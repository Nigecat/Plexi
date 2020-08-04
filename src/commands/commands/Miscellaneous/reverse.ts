import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";

export default class Reverse extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "reverse",
            group: "Miscellaneous",
            description: "Reverse the supplied text",
            args: [
                {
                    name: "text",
                    type: "string",
                    infinite: true,
                },
            ],
        });
    }

    run(message: Message, [text]: [string]): void {
        message.channel.send(text.split("").reverse().join(""));
    }
}
