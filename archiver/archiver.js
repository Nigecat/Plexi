import cliProgress from "cli-progress";
import { SnowflakeUtil } from "discord.js";

Array.prototype.last = () => this[this.length - 1];

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

/*  Format a discord snowflake into something human readable   */
function formatSnowflake(snowflake) {
    const date = SnowflakeUtil.deconstruct(snowflake).date;
    return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
}

/*   Convert a message to the format that sendMessages is expecting   */
function formatMessage(message) {
    if (message.type === "GUILD_MEMBER_JOIN") return { content: `${message.author} joined the server!`, reactions: message.reactions.cache };
    else if (message.embeds.length > 0) return { id: message.id, author: message.author, content: message.content, reactions: message.reactions.cache, payload: { embed: message.embeds[0] } };
    else if (message.attachments.size > 0) return { id: message.id, author: message.author, content: message.content, reactions: message.reactions.cache, payload: { files: Array.from(message.attachments.values()).map(attachment => attachment.attachment) } };
    else return { id: message.id, author: message.author, content: message.content, reactions: message.reactions.cache, payload: {} };
}

/* Returns an array of all the messages in a given channel, the zeroth element is the first message in that channel */
async function getMessages(channel) {
    let messages = [];

    // Get most recent message in channel
    const firstMessage = (await channel.messages.fetch({ limit: 2 })).first();
    messages.push(formatMessage(firstMessage));
    let pos = firstMessage.id;

    while (true) {
        const found = await channel.messages.fetch({ limit: 50, before: pos });
        if (found.array().length === 0) break;
        pos = found.last().id;
        messages = messages.concat(found.map(formatMessage));
        console.log(`Performing message jump [${formatSnowflake(found.last().id)}] | ${messages.length} messages found`);
    }

    // Reverse the messages so the oldest message is at the start of the array
    messages.reverse();
    return messages;
}

/** Send an array of messages to a channel */
async function sendMessages(channel, messages, startFrom = 0) {
    console.log("Clearing webhooks...");
    // Before we start clear all webhooks in the destination channel
    const hooks = await channel.fetchWebhooks();
    for (const hook of hooks.array()) {
        await hook.delete("Clearing space");
    }
    
    // This will hold any webhooks we create during the sending process
    //  They will be mapped to the user snowflake that they represent
    let users = {};

    const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progress.start(messages.length, startFrom);

    for (let i = startFrom; i < messages.length; i++) {
        progress.update(i);

        // If we don't have a webhook for this user
        if (!(messages[i].author.id in users)) {
            // If we have 10 webhooks which is the max then remove all of them before making this new one
            if (Object.keys(users).length >= 10) {
                for (let user in users) {
                    await users[user].delete("Clearing space");
                }
            }

            // Make one
            users[messages[i].author.id] = await channel.createWebhook(messages[i].author.username, {
                avatar: messages[i].author.displayAvatarURL(),
                reason: "Server archiving"
            });
        }

        // Send the message content using the webhook
        //  If the previous message was by the same person don't include the extra author details
        if (i != 0 && messages[i].author.id == messages[i > 0 ? i - 1 : i].author.id) {
            var sent = await users[messages[i].author.id].send(Object.assign({}, messages[i].payload, { content: messages[i].content, allowedMentions: { users : [] } }));
        } else {
            messages[i].content = `[${messages[i].author} | ${formatSnowflake(messages[i].id)}]\n${messages[i].content}`
            var sent = await users[messages[i].author.id].send(Object.assign({}, messages[i].payload, { content: messages[i].content, allowedMentions: { users : [] } }));
        }

        // Add the reactions
        messages[i].reactions.array().forEach(async emoji => {
            await sent.react(emoji._emoji);
        });

        // Sleep for 500ms between each message so we don't get rate limited
        await sleep(500);
    }
    progress.update(messages.length);
    progress.stop();

    // Remove the webhooks
    for (let user in users) {
        await users[user].delete("Finished archiving");
    }
}

export default class Archiver {
    client;
    whitelist;
    active = false;

    constructor(client, whitelist) {
        this.client = client;
        this.whitelist = whitelist;
    }

    async clone(originChannel, targetChannel, destinationChannel) {
        originChannel.send(`Starting clone from target ${targetChannel} to destination ${destinationChannel}`);
        this.active = true;

        const messages = await getMessages(targetChannel);
        sendMessages(destinationChannel, messages, 0);

        this.active = false;
    }

    async resume(originChannel, targetChannel, destinationChannel) {
        originChannel.send(`Resuming from target ${targetChannel} to destination ${destinationChannel}`);
        this.active = true;

        const messages = await getMessages(targetChannel);
        const startAt = (await getMessages(destinationChannel)).length;
        sendMessages(destinationChannel, messages, startAt);
        
        this.active = false;
    }
}