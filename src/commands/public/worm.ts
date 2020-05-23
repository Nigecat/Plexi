import { Message } from "discord.js";
import Command from "../../util/Command.js";

export default Command.create({
    args: ["length"],
    description: "Create a worm of the specified length",
    call (message: Message, args: string[]): void {
        const length: number = Number(args[0]);
        if (!isNaN(length) && length >= 0) {
            message.channel.send(`<:h_:708133267366477944>${"<:b_:708133266644926505>".repeat(length)}<:t_:708133266657640578>`).catch(() => {
                message.channel.send("That worm would be too long to post!");
            });
        } else {
            message.channel.send("Length must be a positive number!");
        }
    }
});