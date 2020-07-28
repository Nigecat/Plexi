import { toEmoji } from "../../util.js";
import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Shout extends Command {
    constructor(client: Client) {
        super(client, {
            name: "shout",
            memberName: "shout",
            group: "misc",
            description: "Shout some text",
            args: [
                {
                    key: "text",
                    prompt: "What text do you want to shout?",
                    type: "string"
                }
            ] 
        });
    }

    async run(message: CommandoMessage, { text }: { text: string }) {
        const emojis = toEmoji(text);
        return message.say(emojis, { allowedMentions: { roles: [], users: [] } });
    }
}