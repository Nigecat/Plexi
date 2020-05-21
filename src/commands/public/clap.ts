import { Message } from "discord.js";
import { lastMessage } from "../util.js";

export default {
    description: "Put the 👏 emoji in the spaces of the previous message",
    async call (message: Message): Promise<void> {
        message.channel.send(`👏 ${(await lastMessage(message.channel)).content.replace(" ", "👏")} 👏`);
    }
}