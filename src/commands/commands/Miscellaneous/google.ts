import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { Message } from "discord.js";
import { lastMessage } from "../../../utils/misc";

export default class Google extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "google",
            group: "Miscellaneous",
            description: "LMGTFY a search query, if no text is supplied it will use the previous message",
            args: [
                {
                    name: "text",
                    type: "string",
                    default: "USE_PREVIOUS",
                },
            ],
        });
    }

    async run(message: Message, [text]: [string]): Promise<void> {
        // Check if we are defaulting to the previous message as the target text
        if (text === "USE_PREVIOUS") text = (await lastMessage(message.channel)).content;

        message.channel.send(encodeURI(`http://lmgtfy.com/?q=${text}`));
    }
}
