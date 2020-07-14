import cliProgress from "cli-progress";
import { SnowflakeUtil } from "discord.js";

Array.prototype.last = () => this[this.length - 1];

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

function formatSnowflake(snowflake) {
    const date = SnowflakeUtil.deconstruct(snowflake).date;
    return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
}

/* Returns an array of all the messages in a given channel, the zeroth element is the first message in that channel */
async function getMessages(channel) {
    let messages = [];

    // Get most recent message in channel
    const firstMessage = (await channel.messages.fetch({ limit: 2 })).first();
    messages.push(firstMessage);
    let pos = firstMessage.id;

    while (true) {
        const found = await channel.messages.fetch({ limit: 50, before: pos });
        if (found.array().length === 0) break;
        pos = found.last().id;
        messages = messages.concat(found.map(message => message));
        console.log(`Performing message jump [${formatSnowflake(found.last().id)}] | ${messages.length} messages found`);
    }

    messages.reverse();
    return messages;
}

/** Send an array of messages to a channel */
async function sendMessages(channel, messages, startFrom = 0) {
    let users = {};

    const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progress.start(messages.length, startFrom);
    for (let i = startFrom; i < messages.length; i++) {
        progress.update(i);

        // If we don't have a webhook for this user
        if (!(messages[i].author.id in users)) {
            // Make one
            users[messages[i].author.id] = await channel.createWebhook(messages[i].author.username, {
                avatar: messages[i].author.displayAvatarURL(),
                reason: "Server archiving"
            });
        }

        // Send the message content using the webhook
        await users[messages[i].author.id].send(`[${messages[i].author} | ${formatSnowflake(messages[i].id)}]\n${messages[i].content}`);

        // Sleep for 500ms between each message so we don't get rate limited
        await sleep(500);
    }
    progress.update(messages.length);
    progress.stop();

    // Remove the webhooks
    for (let user in users) {
        users[user].delete();
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

    }
}