import { Message } from "discord.js";
import Server from "./models/server.js";
import Database from "./models/database.js";


export default async function processCommand(message: Message, database: Database, owner: string) {
    const server = await Server(database, message.guild.id);

    console.log(server);
}