import { Message } from "discord.js";
import { isURL, manipulateImage } from "../../util.js";
import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Char extends Command {
    constructor(client: Client) {
        super(client, {
            name: "char",
            memberName: "char",
            group: "image",
            description: "Char an image",
            userPermissions: ["EMBED_LINKS", "ATTACH_FILES"],
            clientPermissions: ["EMBED_LINKS", "ATTACH_FILES"],
            args: [
                {
                    key: "url",
                    prompt: "What is the url of the image you want to char?",
                    type: "string",
                    validate: isURL
                }
            ]
        });
    }

    async run(message: CommandoMessage, { url }: { url: string }) {
        let response: Promise<Message | Message[]>;
        message.channel.startTyping();

        try {
            const result = await manipulateImage(url, 1);
            response = message.say({ files: [ result ] });
        } catch {
            response = message.say("Unsupported file type.");
        }

        message.channel.stopTyping();
        return response;
    }
}