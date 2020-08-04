import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";

export default class Roll extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "roll",
            group: "Miscellaneous",
            description: "Get a random number (inclusive) between the two specified numbers",
            args: [
                {
                    name: "min",
                    type: "number",
                },
                {
                    name: "max",
                    type: "number",
                },
            ],
        });
    }

    run(message: Message, [min, max]: [number, number]): void {
        message.channel.send(Math.floor(Math.random() * (max - min + 1)) + min);
    }
}
