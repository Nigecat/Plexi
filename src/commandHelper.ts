import { promises as fs } from "fs";
import Server from "./models/server.js";
import Database from "./models/database.js";
import { Message, Client } from "discord.js";
import { Command, CommandData } from "./types.js";

export default async function processCommand(message: Message, database: Database, client: Client, owner: string) {
    const server = await Server(database, message.guild.id);

    // If the message starts with the same prefix as this server
    if (message.content.startsWith(server.prefix)) {
        // Remove the prefix from the message content then get the first word
        const command = message.content.replace(server.prefix, "").split(" ")[0];

        // Compare the entered command against the files in commands/public and get any matching .js files
        const commands = (await fs.readdir("src/commands/public")).filter(cmd => cmd == command + ".js");
        
        // If we found a matching command
        if (commands.length > 0) {
            // Import the command
            const data: Command = (await import(`./commands/public/${commands[0]}`)).default;

            // Verify that the incoming arguments match the command exports
            if (data.args) {
                
            }

            // Verify the the user's permissions match the incoming command permissions
            if (data.perms) {
                
            }

            data.call(<CommandData>{ client, message, database });
        }
    }
}