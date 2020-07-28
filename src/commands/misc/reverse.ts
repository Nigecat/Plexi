import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Reverse extends Command {
    constructor(client: Client) {
        super(client, {
            name: "reverse",
            memberName: "reverse",
            description: "Reverse the specified text",
            group: "misc",
            args: [
                {
                    key: "text",
                    prompt: "What text would you like to reverse?",
                    type: "string"
                }
            ]
        });
    }

    run(message: CommandoMessage, { text }: { text: string }) {
        return message.say(text.split("").reverse().join(""), { allowedMentions: { roles: [], users: [] } });
    }
}