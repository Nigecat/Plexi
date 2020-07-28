import { isURL, manipulateImage } from "../../util.js";
import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Deepfry extends Command {
    constructor(client: Client) {
        super(client, {
            name: "deepfry",
            memberName: "deepfry",
            group: "image",
            description: "Deepfry an image",
            args: [
                {
                    key: "url",
                    prompt: "What is the url of the image you want to deepfry?",
                    type: "string",
                    validate: isURL
                }
            ]
        });
    }

    async run(message: CommandoMessage, { url }: { url: string }) {
        message.channel.startTyping();
        const result = await manipulateImage(url, 8, 0.75);
        message.channel.stopTyping();
        return message.say({ files: [ result ] });
    }
}