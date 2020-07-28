import { COMMUNISM } from "../../util.js";
import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Communism extends Command {
    constructor(client: Client) {
        super(client, {
            name: "communism",
            memberName: "communism",
            group: "misc",
            description: "Make the supplied text communist",
            args: [
                {
                    key: "text",
                    prompt: "What text do you want to run this on?",
                    type: "string"
                }
            ]
        })
    }

    run(message: CommandoMessage, { text }: { text: string }) {
        // Convert the supplied to with a search and replace of communism words
        const converted = text.split(" ").map(word => word in COMMUNISM ? COMMUNISM[word] : word).join(" ");
    
        return message.say("☭ " + converted + " ☭");
    }
}