import { COMMUNISM } from "../../util.js";
import { lastMessage } from "../../util.js";
import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Communism extends Command {
    constructor(client: Client) {
        super(client, {
            name: "communism",
            memberName: "communism",
            group: "misc",
            description: "Make some text communist, if no text is supplied it will use the previous message",
            args: [
                {
                    key: "text",
                    prompt: "What text do you want to make communist?",
                    type: "string",
                    default: "USE_PREVIOUS"
                }
            ]
        })
    }

    async run(message: CommandoMessage, { text }: { text: string }) {
        // Check if we are defaulting to the previous message as the target text
        if (text === "USE_PREVIOUS") text = (await lastMessage(message.channel)).content;
        
        // Convert the text with a search and replace of communism words
        const converted = text.split(" ").map(word => word in COMMUNISM ? COMMUNISM[word] : word).join(" ");
    
        return message.say("☭ " + converted + " ☭", { allowedMentions: { roles: [], users: [] } });
    }
}