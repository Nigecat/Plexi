const { SnowflakeUtil } = require("discord.js");

function validURLImage(url) {
    // true if this url is a png or jpg image.
    return url.endsWith("png") || url.endsWith("jpg");
}


function formatSnowflake(snowflake) {
    const date = SnowflakeUtil.deconstruct(snowflake).date;
    return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
}

function formatMessage(message) {
    if (message.type === "GUILD_MEMBER_JOIN") return `${message.author} joined the server!`;
    else return `${formatSnowflake(message.id)} ${message.author} ${message.content}`;
}

module.exports.send = async function(client, pos, content) {
    if (validURLImage(content)) {
        console.log(`Sending image: ${content}`);
        await client.guilds.cache.get(pos.split("/")[1]).channels.cache.get(pos.split("/")[2]).send({ files: [content] });
        console.log(`Sent image: ${content}`);
    } else {
        console.log(`Sending message: ${content}`);
        await client.guilds.cache.get(pos.split("/")[1]).channels.cache.get(pos.split("/")[2]).send(content);
        console.log(`Sent message: ${content}`);
    }

    return pos;
}

module.exports.shutdown = async function(client, pos) {
    client.destroy();
    process.exit(0);
}

module.exports.cd = async function(client, pos, args) {
    const depth = pos.split("/").length - 1;
    
    // Go up a folder
    if (args == "..") {
        return pos.split("/").slice(0, -1).join("/");
    }

    // If user enters <ID>@<NAME> strip it to just the id
    if (args.includes("@")) {
        args = args.split("@")[0];
    }

    // This means we are at root, cd into a server
    if (depth === 0) {
        // If not a number
        if (!/\d/.test(args)) {
            args = client.guilds.cache.find(guild => guild.name === args).id;
        }
        
        // If specified guild id exists
        if (client.guilds.cache.get(args)) {
            return `${pos}/${args}`;
        }
    }

    // This means we are in a server, cd into a channel
    else if (depth === 1) {
        // If not a number
        if (!/\d/.test(args)) {
            args = client.guilds.cache.get(pos.split("/")[1]).channels.cache.find(channel => channel.name === args).id;
        }
        // If specified channel id exists in guild
        if (client.guilds.cache.get(pos.split("/")[1]).channels.cache.get(args)) {
            return `${pos}/${args}`;
        }
    }

    console.log(`cd: ${args}: No such file or directory`);
    return pos;
}

module.exports.ls = async function(client, pos, args) {
    const depth = pos.split("/").length - 1;
    
    // This means we are at root, list all servers
    if (depth === 0) {
        console.log("\u001b[34m");
        client.guilds.cache.sort((guildA, guildB) => guildA.name.localeCompare(guildB.name)).each(guild => {
            console.log(`${guild.id}@${guild.name}`);
        });
        console.log("\x1b[0m");
    }

    // This means we are in a server, list all channels (with categories)
    else if (depth === 1) {
        console.log("\u001b[34m");
        client.guilds.cache.get(pos.split("/")[1]).channels.cache.each(channel => {
            if (channel.type !== "category") {
                console.log(`${channel.type === "text" ? "[text]  " : "[voice] "} ${channel.id}@${channel.name}`);
            }
        });
        console.log("\x1b[0m");
    }

    // This means we are in a channel, list args most recent messages MAX 50, will default to 5
    else if (depth === 2) {
        args = parseInt(args) || 5;
        if (args[0] > 50) args = 50;
        messages = await client.guilds.cache.get(pos.split("/")[1]).channels.cache.get(pos.split("/")[2]).messages.fetch({ limit: args });
        console.log("\u001b[36m%s\x1b[0m", messages.map(formatMessage).reverse().join("\n"));
    }

    return pos;
}