import { Message } from "discord.js";
import { toEmoji } from "../../util/util.js"
import Command from "../../util/Command.js";

export default <Command> {
    args: "text",
    description: "Make the specified text bigger",
    call (message: Message, args: string): void {
        message.channel.send(toEmoji(args));
    }
}