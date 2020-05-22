import { Message } from "discord.js";
import Database from "../../util/Database.js";
import Server from "../../util/Server.js";

export default {
    args: ["prefix"],
    perms: ["ADMINISTRATOR"],
    description: "Set a custom prefix for this server",
    async call (message: Message, args: string[], database: Database): Promise<void> {
        const prefix: string = args[0];
        const server: Server = new Server(message.guild.id, database);
        await server.init();
        server.update("prefix", prefix);
        message.channel.send(`**Server prefix updated to:** ${prefix}`);
    }
}