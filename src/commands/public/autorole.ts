import { Message } from "discord.js";
import Database from "../../util/Database.js";
import Server from "../../util/Server.js";

export default {
    args: ["set|clear", "@role"],
    perms: ["ADMINISTRATOR"],
    description: "Assign a role to be automatically added to a user when they join this server",
    async call (message: Message, args: string[], database: Database): Promise<void> {
        const id: string = args[0] === "set" 
            ? message.guild.id 
            : args[0] === "clear"
                ? ""
                : null;

        if (id !== null) {
            const server: Server = new Server(message.guild.id, database);
            await server.init();
            message.channel.send("Autorole updated!");
            server.update("autorole", id);
        } 
    }
}