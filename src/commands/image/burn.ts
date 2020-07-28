import { isURL, manipulateImage } from "../../util.js";
import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Burn extends Command {
    constructor(client: Client) {
        super(client, {
            name: "burn",
            memberName: "burn",
            group: "image",
            description: "Burn an image",
            userPermissions: ["EMBED_LINKS", "ATTACH_FILES"],
            clientPermissions: ["EMBED_LINKS", "ATTACH_FILES"],
            args: [
                {
                    key: "url",
                    prompt: "What is the url of the image you want to burn?",
                    type: "string",
                    validate: isURL
                }
            ]
        });
    }

    async run(message: CommandoMessage, { url }: { url: string }) {
        message.channel.startTyping();

        try {
            const result = await manipulateImage(url, 3);
            message.channel.stopTyping();
            return message.say({ files: [ result ] });
        } catch {
            message.channel.stopTyping();
            return message.say("Unsupported file type.");
        }
    }
}