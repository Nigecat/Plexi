const { getGuild, validURLImage, formatMessage } = require("./util.js");

/** Kick a user from the current server (option arg, reason)
* @example kick <snowflake> <reason?>
*/
module.exports.kick = async function(client, pos, args) {
    if (args.includes("@")) {
        args = args.split("@")[0];
    }
    if (args.includes(" ")) {
        const args = args.split(" ");
        const user = args[0];
        args.shift();
        const reason = args;
        await getGuild(client, pos).members.cache.get(user).kick(reason);
    } else {
        await getGuild(client, pos).members.cache.get(args).kick();
    }
    return pos;
}

/** Ban a user from the current server (option arg, reason) 
* @example ban <snowflake> <reason?>
*/
module.exports.ban = async function(client, pos, args) {
    if (args.includes("@")) {
        args = args.split("@")[0];
    }
    if (args.includes(" ")) {
        const args = args.split(" ");
        const user = args[0];
        args.shift();
        const reason = args;
        await getGuild(client, pos).members.cache.get(user).ban({ reason });
    } else {
        await getGuild(client, pos).members.cache.get(args).ban();
    }
    return pos;
}

/** Change the bot's nick 
 * @example nick <newnick>
*/
module.exports.nick = async function(client, pos, name) {
    getGuild(client, pos).members.cache.get(client.user.id).setNickname(name);
    return pos;
}

/**  Create an invite to the current server  
 * @example nick
*/
module.exports.invite = async function(client, pos) {
    const invite = await getGuild(client, pos).channels.cache.first().createInvite({ maxUses: 1 });
    console.log(`https://discord.gg/${invite.code}`);
    return pos;
}

/**  Send a message to the current channel  
 * @example send <text>
*/
module.exports.send = async function(client, pos, content) {
    if (validURLImage(content)) {
        await client.guilds.cache.get(pos.split("/")[1]).channels.cache.get(pos.split("/")[2]).send({ files: [content] });
    } else {
        await client.guilds.cache.get(pos.split("/")[1]).channels.cache.get(pos.split("/")[2]).send(content);
    }
    console.log(`Sent message: ${content}`);

    return pos;
}

/**  List the users of the current server   
 * @example users
*/
module.exports.users = async function(client, pos) {
    console.log(getGuild(client, pos).members.cache.map(member => `\u001b[34m${member.user.id}@${member.user.tag}[${member.nickname || ""}]\x1b[0m \u001b[36m(${member.roles.cache.map(role => role.name).join(" | ")})\x1b[0m ${member.user.bot ? "\u001b[31m[BOT]\x1b[0m" : ""}`).join("\n"));
    return pos;
}

/**   Exit the shell   
 * @example exit
*/
module.exports.exit = async function(client, pos) {
    client.destroy();
    process.exit(0);
}

/**   Cd into a guild / channel  
 * @example cd <(guild/channel)snowflake>
*/
module.exports.cd = async function(client, pos, args) {
    const depth = pos.split("/").length - 1;

    // Return to root
    if (args == "~" || args == "/") {
        return "~";
    }
    
    // Go up a folder
    else if (args == "..") {
        if (pos == "~") return "~";
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
            // Catch if guild does not exist
            try {
                args = client.guilds.cache.find(guild => guild.name === args).id;
            } catch (err) {};
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
            // Catch if channel does not exist
            try {
                args = getGuild(client, pos).channels.cache.find(channel => channel.name === args).id;
            } catch (err) {};
    }
        // If specified channel id exists in guild
        if (getGuild(client, pos).channels.cache.get(args)) {
            return `${pos}/${args}`;
        }
    }

    console.log(`cd: ${args}: The system cannot find the path specified.`);
    return pos;
}

/**  List the available cd locations of the current position   
 * @example ls
*/
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


/**  View all server roles 
 * @example roles
*/
module.exports.roles = async function(client, pos) {
    getGuild(client, pos).roles.cache.each(role => {
        console.log(`${role.id}@${role.name}`);
    });

    return pos;
}