import Server from "./models/server.js";
import Database from "./models/database.js";
import { Message, Client } from "discord.js";

export default async function processCommand(message: Message, database: Database, client: Client, owner: string) {
    const server = await Server(database, message.guild.id);

}