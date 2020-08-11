import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { fetch } from "../../../utils/misc";

export default class Cow extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "cow",
            group: "Fun",
            description: "Force a cow to say the specified text",
            args: [
                {
                    type: "string",
                    name: "text",
                    infinite: true,
                },
            ],
        });
    }

    async run(message: Message, [text]: [string]): Promise<void> {
        const res = await fetch(`http://cowsay.morecode.org/say?format=json&message=${encodeURI(text)}`, true);
        message.channel.send("```\n" + res.cow + "\n```");
    }
}
