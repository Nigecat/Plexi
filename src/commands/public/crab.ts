import { lastMessage } from "../helper.js";
import { Command, CommandData, InvalidArgument } from "../../types.js";

export default {
    description: "🦀 Add crabs around the previous message 🦀",
    args: ["[text]"],
    async call({ message, args }: CommandData) {
        if (args.length === 0) throw new InvalidArgument();

        message.channel.send(`🦀 ${(await lastMessage(message.channel)).content} 🦀`);
    }
} as Command