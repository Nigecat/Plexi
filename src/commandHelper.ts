import { Message, Client } from "discord.js";
import { logBlue, logYellow } from "./util/colour.js";
import Database from "./util/Database.js";
import Server from "./util/Server.js";

export default function processCommand(message: Message, client: Client, database: Database): void {
    let server = new Server(message.id, database);
    
    if (message.content.startsWith(server.prefix)) {
        logBlue(`[status] Executing command  [${message.content}]  from ${message.author.tag} in ${message.guild.name}`);
    }
}