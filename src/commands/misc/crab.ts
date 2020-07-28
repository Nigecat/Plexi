import { lastMessage } from "../../util.js";
import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Crab extends Command {
    constructor(client: Client) {
        super(client, {
            name: "crab",
            memberName: "crab",
            group: "misc",
            description: "🦀 Put crabs around some text, if no text is supplied it will use the previous message 🦀",
            args: [
                {
                    key: "text",
                    prompt: "What text do you want to make communist?",
                    type: "string",
                    default: "USE_PREVIOUS"
                }
            ]
        });
    }

    async run(message: CommandoMessage, { text }: { text: string }) {
        // Check if we are defaulting to the previous message as the target text
        if (text === "USE_PREVIOUS") text = (await lastMessage(message.channel)).content;

        return message.say("🦀 " + text + " 🦀");
    }
}