const { Client, MessageEmbed, SnowflakeUtil } = require("discord.js");
const cliProgress = require("cli-progress");
const client = new Client();
const allowed = ["307429254017056769", "547881813088010241"];
var lock = false;

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

function formatMessage(message) {
    const content = `${formatSnowflake(message.id)} ${message.author} ${message.content}`;
         
    if (message.type === "GUILD_MEMBER_JOIN") return { content: `${message.author} joined the server!`, reactions: message.reactions.cache };
    else if (message.embeds.length > 0) return { content, embed: message.embeds[0], reactions: message.reactions.cache };
    else if (message.attachments.size > 0) return { content, files: Array.from(message.attachments.values()).map(attachment => attachment.attachment), reactions: message.reactions.cache };
    else return { content, reactions: message.reactions.cache };
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

    messages.reverse();
    return messages;
}

/** Send an array of messages to a channel */
async function sendMessages(channel, messages, startFrom = 0) {
    const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progress.start(messages.length, startFrom);
    for (let i = startFrom; i < messages.length; i++) {
        progress.update(i);
        const sent = await channel.send(messages[i]);
        messages[i].reactions.array().forEach(async emoji => {
            await sent.react(emoji._emoji);
        });
        await sleep(500);
    }
    progress.update(messages.length);
    progress.stop();
}

// Disable debug output if something is running (it messes with the progress bar)
client.on("debug", info => { if (!lock) console.log(info) });

client.on("message", async message => {
    if (!allowed.includes(message.author.id)) return;

    if (message.content === "a%abort") {
        console.log("-----ABORTING-----");
        process.exit(1);
    }

    else if (message.content.startsWith("a%info") && message.content.split(" ").length == 2) {
        const server = client.guilds.cache.get(message.content.split(" ")[1]);
        const embed = new MessageEmbed()
            .setTitle(server.name)
            .setThumbnail(server.iconURL())
            .addField("ID:", server.id)
            .addField("Created at:", server.createdAt)
            .addField("Owner:", `${server.owner} (${server.ownerID})`);
        message.channel.send({ embed });
    }

    else if (message.content.startsWith("a%") && message.content.split(" ").length === 3) {
        if (lock) {
            message.channel.send("A clone is already in progress, please wait for it to finish first!");
            return;
        }


        lock = true;

        const type = message.content.split(" ")[0].substring(2);
        const source = client.channels.cache.get(message.content.split(" ")[1]);
        const destination = client.channels.cache.get(message.content.split(" ")[2]);

        message.channel.send(`Performing operation ${type}, reading source \`#${source.name} in ${source.guild.name}\` to destination \`#${destination.name} in ${destination.guild.name}\``);
        const messages = await getMessages(source);

        if (type === "clone") {
            await sendMessages(destination, messages);
        } else if (type === "resume") {
            await sendMessages(destination, messages, (await getMessages(destination)).length);
        }

        message.author.send(`Operation ${type}, \`#${source.name} in ${source.guild.name}\` => \`#${destination.name} in ${destination.guild.name}\` finished!`);

        lock = false;
    }
});

client.login(require("../src/data/auth.json").token);