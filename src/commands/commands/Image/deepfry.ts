import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { lastMessage } from "../../../utils/misc";
import { isDiscordURL, manipulateImage } from "../../../utils/image";

export default class Deepfry extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "deepfry",
            group: "Image",
            description: "Deepfry an image",
            details: "If no url is supplied it will act on the previous message, the url MUST be a discord attachment.",
            userPermissions: ["EMBED_LINKS", "ATTACH_FILES"],
            clientPermissions: ["EMBED_LINKS", "ATTACH_FILES"],
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

            const output = await manipulateImage(url, 8);

            message.channel.send("", { files: [output] });
        } catch {
            message.channel.send("Unsupported file type (or the previous message was not an attachment)");
        } finally {
            message.channel.stopTyping();
        }
    }
}
