import { Message } from "discord.js";

export default {
    args: "text",
    description: "Reverse the specified text",
    call (message: Message, args: string): void {
        message.channel.send(`\`${args}\`   reversed is   \`${args.split("").reverse().join("")}\``);
    }
}