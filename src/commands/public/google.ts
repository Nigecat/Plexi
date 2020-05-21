import { Message } from "discord.js";

export default {
    args: "query",
    description: "LMGTFY a search query",
    call (message: Message, args: string): void {
        message.channel.send(`http://lmgtfy.com/?q=${args.replace(" ", "+")}`);
    }
}