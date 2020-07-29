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
            clientPermissions: ["EMBED_LINKS", "ATTACH_FILES"],
            args: [
                {
                    key: "url",
                    prompt: "What is the url of the image you want to panfry?",
                    type: "string",
                    validate: isURL,
                    default: "USE_PREVIOUS"
                }
            ]
        });
    }

    async run(message: CommandoMessage) {
        let response: Promise<Message | Message[]>;
        message.channel.startTyping();

        try {
            const url = (await lastMessage(message.channel)).attachments.first().url;
            const result = await manipulateImage(url, 9, 0.3);
            response = message.say({ files: [ result ] });
        } catch {
            response = message.say("Unsupported file type (or the previous message was not an image)");
        }

        message.channel.stopTyping();
        return response;
    }
}