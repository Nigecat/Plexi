import { Message } from "discord.js";
import { oneLine } from "common-tags";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { lastMessage } from "../../../utils/misc";

export default class Crab extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "crab",
            group: "Fun",
            description: oneLine`
                Put the 🦀 emoji around the specified text, 
                if no text is supplied it will use the previous message
            `,
            args: [{ name: "text", type: "string", default: "USE_PREVIOUS" }],
        });
    }

    async run(message: Message, [text]: [string]): Promise<void> {
        // Check if we are defaulting to the previous message as the target text
        if (text === "USE_PREVIOUS") text = (await lastMessage(message.channel)).content;

        message.channel.send(`🦀 ${text} 🦀`);
    }
}
