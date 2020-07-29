import { Message } from "discord.js";
import { isURL, manipulateImage, lastMessage } from "../../util.js";
import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Burn extends Command {
    constructor(client: Client) {
        super(client, {
            name: "burn",
            memberName: "burn",
            group: "image",
            description: "Burn an image, NOTE: This will act on the image in the previous message",
            clientPermissions: ["ATTACH_FILES"],
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

    async run(message: CommandoMessage) {
        let response: Promise<Message | Message[]>;
        message.channel.startTyping();

        try {
            const url = (await lastMessage(message.channel)).attachments.first().url;
            const result = await manipulateImage(url, 3);
            response = message.say({ files: [ result ] });
        } catch {
            response = message.say("Unsupported file type (or the previous message was not an image)");
        }

        message.channel.stopTyping();
        return response;
    }
}