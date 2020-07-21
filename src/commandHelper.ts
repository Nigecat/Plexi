import { existsSync } from "fs";
import Server from "./models/server.js";
import Database from "./models/database.js";
import { Message, Client } from "discord.js";
import { Command, CommandData, InvalidArgument } from "./types.js";

export default async function processCommand(message: Message, database: Database, client: Client, owner: string) {
    const server = await Server(database, message.guild.id);

    // If the message starts with the same prefix as this server
    if (message.content.startsWith(server.prefix)) {
        // Remove the prefix from the message content then get the first word
        const command = message.content.replace(server.prefix, "").split(" ")[0];

        // If we found a matching command
        if (existsSync(`src/commands/public/${command}.js`)) {
            // Import the command
            const data: Command = (await import(`./commands/public/${command}.js`)).default;

            // Extract the args from the message by removing the command from it
            const args = message.content.split(" ");
            args.shift();

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
                await data.call(<CommandData>{ client, message, args, database });
            } catch (err) {
                // If the command throws an invalid argument error then send the expected arguments
                if (err instanceof InvalidArgument) {
                    await message.channel.send(`Invalid command syntax, expected syntax: \`${server.prefix}${command} ${data.args.join(" ")}\``);
                } else {
                    await message.channel.send(`Oops!\nIt appears that you have somehow managed to cause a fatel error, attempting to run the command again will usually fix the issue. If all else fails please contact <@${owner}>.\nHere are the error details:\n\`\`\`Time: ${(new Date()).toLocaleString()}\n\nContent: ${message.content}\n\nLocation: commands/public/${command}.ts\n\nError: ${err}\n\n---------- BEGIN STACK TRACE ----------\n${err.stack}\n---------- END STACK TRACE ----------\`\`\``);
                }
            } finally {
                message.channel.stopTyping(true);
            }
        }
    }
}