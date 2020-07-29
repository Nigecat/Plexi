import { Message } from "discord.js";
import { isURL, manipulateImage, lastMessage } from "../../util.js";
import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Burn extends Command {
    constructor(client: Client) {
        super(client, {
            name: "burn",
            memberName: "burn",
            group: "image",
            description: "Burn an image, NOTE: If no url is supplied it will act on the previous message",
            userPermissions: ["EMBED_LINKS", "ATTACH_FILES"],
            clientPermissions: ["EMBED_LINKS", "ATTACH_FILES"],
            args: [
                {
                    key: "url",
                    prompt: "What is the url of the image you want to burn?",
                    type: "string",
                    validate: isURL,
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

            const result = await manipulateImage(url, 3);
            response = message.say({ files: [ result ] });
        } catch {
            response = message.say("Unsupported file type.");
        }

        message.channel.stopTyping();
        return response;
    }
}