import Server from "./models/server.js";
import Database from "./models/database.js";
import { existsSync, readdirSync } from "fs";
import { Message, Client, MessageEmbed } from "discord.js";
import { Command, CommandData, InvalidArgument } from "./types.js";

export default async function processCommand(message: Message, database: Database, client: Client, owner: string) {
    const server = await Server(database, message.guild.id);

    // Check if this is the global help command
    if (message.content === `${server.prefix}help`) {
        const files = readdirSync("src/commands/public/");
        const embed = new MessageEmbed({
            title: `This server's is currently: ${server.prefix}`,
            author: { name: client.user.username, iconURL: client.user.avatarURL({ format: "png", dynamic: true }) },
            timestamp: new Date(),
            color: "#7289DA",
            footer: { text: `v${(await import("../package.json")).default.version}` },
            fields: [{ name: `Use ${server.prefix}help <command> to get more details`, value: files.filter(file => file.endsWith(".ts")).map(file => server.prefix + file.split(".")[0]) }]
        });
        message.channel.send({ embed });
    }

    // Check if this is a normal help command
    else if (message.content.startsWith(`${server.prefix}help`)) {
        if (message.content.split(" ").length !== 2) return;
        const command = message.content.split(" ")[1];
        if (existsSync(`src/commands/public/${command}.js`)) {
            const data: Command = (await import(`./commands/public/${command}.js`)).default;
            const help = [{ header: "Command", value: `${server.prefix}${command} ${data.args ? data.args.join(" ") : ""}` }, { header: "Description", value: data.description }];
            if (data.perms) help.push({ header: "Required Permissions", value: data.perms.join(" | ") });
            message.channel.send("```markdown\n" + help.map(section => `# ${section.header}\n${section.value}`).join("\n\n") + "\n```");
        }
    }

    // If the message starts with the same prefix as this server
    else if (message.content.startsWith(server.prefix)) {
        // Remove the prefix from the message content then get the first word
        const command = message.content.replace(server.prefix, "").split(" ")[0];

        // Extract the args from the message by removing the command from it
        const args = message.content.split(" ");
        args.shift();

        // If we found a matching command
        if (existsSync(`src/commands/public/${command}.js`)) {
            // Import the command
            const data: Command = (await import(`./commands/public/${command}.js`)).default;

            // Verify the the user's permissions match the incoming command permissions
            if (data.perms) {
                // If they aren't all found in the message author
                if (!data.perms.every(perm => message.member.permissions.has(perm))) {
                    message.channel.send(`You are missing permission(s) \`[${data.perms.join(", ")}]\` to run this command.`);
                    return;
                }
            }

            // Make the bot display as typing for the duration of the command
            message.channel.startTyping();

            try {
                await data.call({ client, message, args, database } as CommandData);
            } catch (err) {
                // If the command throws an invalid argument error then send the expected arguments
                if (err instanceof InvalidArgument) {
                    await message.channel.send(`Invalid command syntax, expected syntax: \`${server.prefix}${command} ${data.args.join(" ")}\``);
                } else {
                    await message.channel.send(`Oops!\nIt appears that you have somehow managed to cause a fatal error, attempting to run the command again will usually fix the issue. If all else fails please contact <@${owner}>.\nHere are the error details:\n\`\`\`Time: ${(new Date()).toLocaleString()}\n\nContent: ${message.content}\n\nLocation: commands/public/${command}.ts\n\nError: ${err}\n\n---------- BEGIN STACK TRACE ----------\n${err.stack}\n---------- END STACK TRACE ----------\`\`\``);
                }
            } finally {
                message.channel.stopTyping(true);
            }
        }

        // Trigger any private commands as well
        if (message.author.id === owner && existsSync(`src/commands/private/${command}.js`)) {
            (await import(`./commands/private/${command}.js`)).default({ client, message, args, database } as CommandData);
        }
    }
}