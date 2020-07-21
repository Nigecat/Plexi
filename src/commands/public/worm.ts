import { Command, CommandData, InvalidArgument } from "../../types.js";

export default {
    description: "Make a worm",
    args: ["<length>"],
    call({ message, args }: CommandData) {
        if (args.length !== 1 || isNaN(args[0] as any) || Number(args[0]) < 0) throw new InvalidArgument();

        const worm = `<:h_:708133267366477944>${"<:b_:708133266644926505>".repeat(Number(args[0]))}<:t_:708133266657640578>`;
        
        // Ensure the text is under the max message character limit of 2000 characters
        if (worm.length < 2000) {
            message.channel.send(worm);
        } else {
            message.channel.send("That worm would be too long to post!");
        }
    }
} as Command