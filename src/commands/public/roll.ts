import { Message } from "discord.js";
import Command from "../../util/Command.js";

export default <Command> {
    args: ["min", "max"],
    description: "Get a random number between <min> and <max> (inclusive)",
    call (message: Message, args: string[]) {
        const min: number = Math.ceil(Number(args[0]));
        const max: number = Math.floor(Number(args[1]));
        message.channel.send(Math.floor(Math.random() * (max - min + 1)) + min);
    }
}