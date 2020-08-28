import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { isDiscordURL } from "../../../utils/image";
import { lastMessage, sendBufApi } from "../../../utils/misc";

export default class ToBeContinued extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "tobecontinued",
            description: `Draws an image with the "To Be Continued..." arrow`,
            group: "Generator",
            details: "If no url is supplied it will act on the previous message, the url MUST be a discord attachment.",
            userPermissions: ["ATTACH_FILES"],
            args: [
                {
                    name: "url",
                    type: "string",
                    default: "USE_PREVIOUS",
                    validate: isDiscordURL,
                },
            ],
        });
    }

    async run(message: Message, [url]: [string]): Promise<void> {
        message.channel.startTyping();

        try {
            // Check if we are defaulting to the previous message as the target text
            if (url === "USE_PREVIOUS") {
                const msg = await lastMessage(message.channel);
                if (isDiscordURL(msg.content)) url = msg.content;
                else url = msg.attachments.first().url;
            }

            sendBufApi(
                `https://emilia-api.xyz/api/to-be-continued?apiKey=${process.env.EMILIA_TOKEN}&image=${url}`,
                message.channel,
            );
        } catch {
            message.channel.send("Unsupported file type (or the previous message was not an attachment)");
        } finally {
            message.channel.stopTyping();
        }
    }
}
