import { lastMessage } from "../../util.js";
import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Google extends Command {
    constructor(client: Client) {
        super(client, {
            name: "google",
            memberName: "google",
            description: "LMGTFY a search query, if no text is supplied it will use the previous message",
            group: "misc",
            args: [
                {
                    key: "text",
                    prompt: "What text do you want to LMGTFY?",
                    type: "string",
                    default: "USE_PREVIOUS"
                }
            ]
        });
    }

    async run(message: CommandoMessage, { text }: { text: string }) {
        // Check if we are defaulting to the previous message as the target text
        if (text === "USE_PREVIOUS") text = (await lastMessage(message.channel)).content;
        
        return message.say(encodeURI("http://lmgtfy.com/?q=" + text), { allowedMentions: { roles: [], users: [] } });
    }
}