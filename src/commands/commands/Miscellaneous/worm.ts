import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";

export default class Worm extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "worm",
            group: "Miscellaneous",
            description: "Make a worm of the specified length",
            args: [
                {
                    name: "length",
                    type: "number",
                },
            ],
        });
    }

    run(message: Message, [length]: [number]): void {
        const worm = `<:h_:708133267366477944>${"<:b_:708133266644926505>".repeat(length)}<:t_:708133266657640578>`;

        // Only respond if we are under the max message character limit
        if (worm.length > 2000) {
            message.channel.send("That worm would be too long to post!");
        } else {
            message.channel.send(worm);
        }
    }
}
