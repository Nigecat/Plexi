import { Message } from "discord.js";
import Command from "../../util/Command.js";

export default Command.create({
    args: "text",
    description: "Reverse the specified text",
    call (message: Message, args: string): void {
        message.channel.send(`\`${args}\`   reversed is   \`${args.split("").reverse().join("")}\``);
    }
});