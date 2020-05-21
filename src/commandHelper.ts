import { logBlue } from "./util/colour.js";
import Server from "./util/Server.js";
import { Message, Client } from "discord.js";
import Database from "./util/Database.js";
import { existsSync } from "fs";

export default async function processCommand(message: Message, database: Database, client: Client): Promise<void> {
    let server = new Server(message.guild.id, database);

    if (message.content.startsWith(server.prefix)) {
        logBlue(`[status] Executing command  [${message.content}]  from ${message.author.tag} in ${message.guild.name}`);

        // Extract first word after the prefix
        const command: string = message.content.replace(server.prefix, "").split(" ")[0];

        // Extract everything apart from the first word
        const args: string[] = message.content.split(" ").slice(1);

        // The file that the command would be contained in
        const file: string = `./commands/public/${command}.js`;

        // If the command is found
        if (existsSync(file)) {
            const data = (await import(file)).default;

            // Ensure the user has the permissions to run this command
            if (!data.perms && !message.member.hasPermission(data.perms)) {
                message.channel.send(`It appears you are missing the permission(s) \`${data.perms.join(" ")}\` to run this command`);
            }

            // If no args are required for this command
            else if (!data.args) {
                data.call(message, [], database, client);
            }

            // Check if expected arg is a string (this means it can be any length)
            else if (typeof data.args == "string") {
                // If the user didn't enter a blank string then call the function
                if (args.join(" ") != "") {
                    data.call(message, args.join(" "), database, client);

                } else {
                    message.channel.send(`Command syntax error, expected syntax: \`${server.prefix}${command} [${data.args}]\``);
                }
            } 
            
            // If incorrect number of args or incorrect number of user mentions
            else if (data.args.length != args.length || message.mentions.users.array().length != data.args.filter((arg: string) => arg.startsWith("@")).length) {
                message.channel.send(`Command syntax error, expected syntax: \`${server.prefix}${command} ${data.args.map((arg: string) => `<${arg}>`).join(" ")}\``);
            } 
            
            else {
                data.call(message, args, database, client);
            }
        }
    }
}