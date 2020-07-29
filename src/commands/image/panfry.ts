import { Message } from "discord.js";
import { isURL, manipulateImage, lastMessage } from "../../util.js";
import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Panfry extends Command {
    constructor(client: Client) {
        super(client, {
            name: "panfry",
            memberName: "panfry",
            group: "image",
            description: "Panfry an image, NOTE: If no url is supplied it will act on the previous message",
            userPermissions: ["EMBED_LINKS", "ATTACH_FILES"],
            clientPermissions: ["EMBED_LINKS", "ATTACH_FILES"],
            args: [
                {
                    key: "url",
                    prompt: "What is the url of the image you want to panfry?",
                    type: "string",
                    default: "USE_PREVIOUS"
                }
            ]
        });
    }

    async run(message: CommandoMessage, { url }: { url: string }) {
        let response: Promise<Message | Message[]>;
        message.channel.startTyping();

        try {
            // Check if we are defaulting to the previous message as the target text
            if (url === "USE_PREVIOUS") url = (await lastMessage(message.channel)).attachments.first().url;

            // If the url is a discord attachment
            if (/(http|https):\/\/cdn.(discord|discordapp).com\/attachments\//.test(url)) {
                const result = await manipulateImage(url, 9, 0.3);
                response = message.say({ files: [ result ] });
            } else {
                response = message.say("The image must be a discord attachment!");
            }
        } catch {
            response = message.say("Unsupported file type (or the previous message was not an image)");
        }

        message.channel.stopTyping();
        return response;
    }
}