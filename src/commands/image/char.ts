import { isURL, manipulateImage } from "../../util.js";
import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Char extends Command {
    constructor(client: Client) {
        super(client, {
            name: "char",
            memberName: "char",
            group: "image",
            description: "Char an image",
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
        message.channel.startTyping();
        const result = await manipulateImage(url, 1, 0.75);
        message.channel.stopTyping();
        return message.say({ files: [ result ] });
    }
}