import log from "./util/logger.js";
import Server from "./util/Server.js";
import { Message, Client, MessageEmbed, BitFieldResolvable, PermissionString } from "discord.js";
import Database from "./util/Database.js";
import { existsSync, promises as fs } from "fs";
import { formatMarkdown } from "./util/util.js";
import User from "./util/User.js";
import { Command } from "./util/Command.js";


async function runCommand(data: Command, message: Message, args: (string | string[]), database: Database, client: Client) {
    const result = data.call(message, args, database, client);
    if (result instanceof Promise) {
        message.channel.startTyping();
        // Force stop typing after 5 seconds because the bot sometimes gets stuck
        setTimeout(message.channel.stopTyping, 5000);
        await result;
        message.channel.stopTyping();
    }
}


export default async function processCommand(message: Message, database: Database, client: Client, owner: string): Promise<void> {
    const server: Server = new Server(message.guild.id, database);
    await server.init();

    // Custom code for 264163117078937601 (Pinpointpotato#9418) AKA the ideas man
    if (message.author.id === "264163117078937601" && message.content.toLowerCase().includes("you know why they call me the ideas man")) {
        message.channel.send("cuz i CLEEEEEEAaaan up");
    }


    // Check if message contains 'peanut' and if so 
    //     increase the peanut counter for that user by how many times it appears
    if (message.content.toLowerCase().includes("peanut")) {
        const user: User = new User(message.author.id, database);
        await user.init();
        user.update("peanuts", (Number(user.peanuts) + (message.content.toLowerCase().match(/peanut/g) || []).length).toString());
    }   


    // Literally just pseudo-nitro (since bots can use emotes like how nitro does)
    if (message.content.startsWith("g`")) {
        // Remove first two characters of message (g`)
        message.content = message.content.slice(2);

        // Find all matching emojis and get the id and whether or not it is animated
        const emojis: (string | boolean)[][] = client.emojis.cache.filter(emoji => emoji.name === message.content).map(emoji => [emoji.id, emoji.animated]);

        // If an emoji was found
        if (emojis.length > 0) {
            const embed: MessageEmbed = new MessageEmbed()
                .setImage(`https://cdn.discordapp.com/emojis/${emojis[0][0]}${emojis[0][1] ? ".gif" : ".png"}`)
                .setFooter(message.author.tag);
            message.channel.send({ embed });
            message.delete();
        }
    }

    

    // General help command that lists the commands
    if (message.content === "$help" || message.content === `${server.prefix}help`) {
        const embed: MessageEmbed = new MessageEmbed()
            .setColor("#7289DA ")
            .setTitle(`This server's prefix is currently: ${server.prefix}`)
            .setAuthor(client.user.username, client.user.avatarURL())
            .setTimestamp(new Date())
            .setFooter(`v${(await import("../package.json")).default.version}`);

        // Get a list of valid commands based on the files in /commands/public/
        const commands: string[] = (await fs.readdir("./src/commands/public/"))   // Read files
            .filter(file => file.endsWith(".js"))                       // Remove all non .js files
            .map(file => `${server.prefix}${file.split(".")[0]}`);   // Set command text to {prefix}{commandName}

        embed.addField(`(use ${server.prefix}help <command> to get more details on a command)`, commands.join("\n"));
        message.channel.send({ embed });
    }


    // Help command to get information on a specific command
    else if (message.content.startsWith(`${server.prefix}help`)) {
        // If the command exists
        if (existsSync(`./src/commands/public/${message.content.split(" ")[1]}.js`)) {
            const data: Command = (await import(`./commands/public/${message.content.split(" ")[1]}.js`)).default;

            // If no perms default to displaying NONE
            if (!data.perms) {
                data.perms = ["NONE"];
            }

            // If args are string wrap them in []
            if (typeof data.args === "string") {
                data.args = `[${data.args}]`;
            }

            // Otherwise wrap each argument in <> if any exist
            else if (typeof data.args === "object") {
                data.args = data.args.map((arg: string) => `<${arg}>`).join(" ");
            }

            // Send as markdown
            message.channel.send(formatMarkdown([
                "# Command", 
                `${server.prefix}${message.content.split(" ")[1]} ${data.args || ""}\n`, 
                "# Description", 
                `${data.description}\n`, 
                "# Required Permissions", 
                data.perms.join(", ")
            ]));
        }
    }


    // General command runner
    else if (message.content.startsWith(server.prefix)) {
        log("status", `Executing command  [${message.content}]  from ${message.author.tag} in ${message.guild.name}`);

        // Extract first word after the prefix
        const command: string = message.content.replace(server.prefix, "").split(" ")[0];

        // Extract everything apart from the first word
        const args: string[] = message.content.split(" ").slice(1);

        // If the command is found
        if (existsSync(`./src/commands/public/${command}.js`)) {
            const data: Command = (await import(`./commands/public/${command}.js`)).default;

            // Ensure the user has the permissions to run this command
            if (!data.perms && !message.member.hasPermission(data.perms as BitFieldResolvable<PermissionString>)) {
                message.channel.send(`It appears you are missing the permission(s) \`${data.perms.join(" ")}\` to run this command`);
            }

            // If no args are required for this command
            else if (!data.args) {
                runCommand(data, message, [], database, client);
            }

            // Check if expected arg is a string (this means it can be any length)
            else if (typeof data.args === "string") {
                // If the user didn't enter a blank string then call the function
                if (args.join(" ") !== "") {
                    runCommand(data, message, args.join(" "), database, client);
                } else {
                    message.channel.send(`Command syntax error, expected syntax: \`${server.prefix}${command} [${data.args}]\``);
                }
            }

            // If something in the command args is incorrect (the if statement of jank)
            else if (data.args.length !== args.length 
                        || !data.args.every((arg: string, i: number) => arg.includes("|") ? arg.split("|").includes(args[i]) : true)
                        || message.mentions.users.array().length !== data.args.filter((arg: string) => arg.startsWith("@user")).length
                        || message.mentions.roles.array().length !== data.args.filter((arg: string) => arg.startsWith("@role")).length) {
                message.channel.send(`Command syntax error, expected syntax: \`${server.prefix}${command} ${data.args.map((arg: string) => `<${arg}>`).join(" ")}\``);
            }

            else {
                runCommand(data, message, args, database, client);
            }
        }

        // Restricted commands that can only be run by the bot owner
        if (message.author.id === owner && existsSync(`./src/commands/private/${command}.js`)) {
            (await import(`./commands/private/${command}.js`)).default(message, database, client);
        }
    }
}