import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";

export default class Say extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "say",
            group: "Debug",
            description: "Make the bot say something",
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
        message.channel.send(text);
    }
}
