import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { lastMessage } from "../../../utils/misc";

export default class Communism extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "communism",
            group: "Fun",
            description: "Make some text communist, if no text is supplied it will use the previous message",
            args: [{ name: "text", type: "string", default: "USE_PREVIOUS" }],
        });
    }

    async run(message: Message, [text]: [string]): Promise<void> {
        const COMMUNISM = {
            my: "our",
            i: "we",
            me: "we",
            your: "our",
            you: "we",
            "any reason": "for the great communist nation",
        };

        // Check if we are defaulting to the previous message as the target text
        if (text === "USE_PREVIOUS") text = (await lastMessage(message.channel)).content;

        // Convert the text with a search and replace of communism words
        const converted = text
            .split(" ")
            .map((word) => (word in COMMUNISM ? COMMUNISM[word] : word))
            .join(" ");

        message.channel.send(`☭ ${converted} ☭`);
    }
}
