import { Message } from "discord.js";
import { isURL, manipulateImage } from "../../util.js";
import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Panfry extends Command {
    constructor(client: Client) {
        super(client, {
            name: "panfry",
            memberName: "panfry",
            group: "image",
            description: "Panfry an image",
            userPermissions: ["EMBED_LINKS", "ATTACH_FILES"],
            clientPermissions: ["EMBED_LINKS", "ATTACH_FILES"],
            args: [
                {
                    key: "url",
                    prompt: "What is the url of the image you want to panfry?",
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
            const result = await manipulateImage(url, 9, 0.3);
            response = message.say({ files: [ result ] });
        } catch {
            response = message.say("Unsupported file type.");
        }

        message.channel.stopTyping();
        return response;
    }
}