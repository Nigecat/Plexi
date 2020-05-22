import { Message } from "discord.js";
import { toEmoji } from "../../util/util.js"

export default {
    args: "text",
    description: "Make the specified text bigger",
    call (message: Message, args: string): void {
        message.channel.send(toEmoji(args));
    }
}