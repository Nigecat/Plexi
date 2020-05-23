import { Message } from "discord.js";
import Command from "../../util/Command.js";

export default <Command> {
    args: "query",
    description: "LMGTFY a search query",
    call (message: Message, args: string): void {
        message.channel.send(`http://lmgtfy.com/?q=${args.replace(" ", "+")}`);
    }
}