const { getGuild, validURLImage, formatMessage } = require("./util.js");

/**  Create an invite to the current server  */
module.exports.invite = async function(client, pos) {
    const invite = await getGuild(client, pos).channels.cache.first().createInvite({ maxUses: 1 });
    console.log(`https://discord.gg/${invite.code}`);
    return pos;
}

/***  Send a message to the current channel  */
module.exports.send = async function(client, pos, content) {
    console.log(`Sending image: ${content}`);
    if (validURLImage(content)) {
        await client.guilds.cache.get(pos.split("/")[1]).channels.cache.get(pos.split("/")[2]).send({ files: [content] });
    } else {
        await client.guilds.cache.get(pos.split("/")[1]).channels.cache.get(pos.split("/")[2]).send(content);
    }
    console.log(`Sent message: ${content}`);

    return pos;
}

/**  List the users of the current server   */
module.exports.users = async function(client, pos) {
    console.log(getGuild(client, pos).members.cache.map(member => `\u001b[34m${member.user.id}@${member.user.tag}[${member.nickname || ""}]\x1b[0m \u001b[36m(${member.roles.cache.map(role => role.name).join(" | ")})\x1b[0m ${member.user.bot ? "\u001b[31m[BOT]\x1b[0m" : ""}`).join("\n"));
    return pos;
}

/**   Exit the shell   */
module.exports.exit = async function(client, pos) {
    client.destroy();
    process.exit(0);
}

/**   Cd into a guild / channel  */
module.exports.cd = async function(client, pos, args) {
    const depth = pos.split("/").length - 1;

    // Return to root
    if (args == "~" || args == "/") {
        return "~";
    }
    
    // Go up a folder
    else if (args == "..") {
        return pos.split("/").slice(0, -1).join("/");
    }

    // If user enters <ID>@<NAME> strip it to just the id
    else if (args.includes("@")) {
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
            args = getGuild(client, pos).channels.cache.find(channel => channel.name === args).id;
        }
        // If specified channel id exists in guild
        if (getGuild(client, pos).channels.cache.get(args)) {
            return `${pos}/${args}`;
        }
    }

    console.log(`cd: ${args}: No such file or directory`);
    return pos;
}

/**  List the available cd locations of the current position   */
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
        getGuild(client, pos).channels.cache.each(channel => {
            if (channel.type !== "category") {
                console.log(`${channel.type === "text" ? "[text]  " : "[voice] "} ${channel.id}@${channel.name}`);
            }
        });
        console.log("\x1b[0m");
    }

    // This means we are in a channel, list args most recent messages MAX 50, will default to 5
    else if (depth === 2) {
        args = parseInt(args) || 10;
        if (args[0] > 50) args = 50;
        messages = await getGuild(client, pos).channels.cache.get(pos.split("/")[2]).messages.fetch({ limit: args });
        console.log("\u001b[36m%s\x1b[0m", messages.map(formatMessage).reverse().join("\n"));
    }

    return pos;
}