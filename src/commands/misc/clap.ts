import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Clap extends Command {
    constructor(client: Client) {
        super(client, {
            name: "clap",
            memberName: "clap",
            group: "misc",
            description: "Put the 👏 emoji in the spaces of the specified text",
            args: [
                {
                    key: "text",
                    prompt: "What text do you want to apply this to?",
                    type: "string"
                }
            ]
        });
    }

    run(message: CommandoMessage, { text }: { text: string }) {
        return message.say(`👏 ${text.replace(" ", " 👏 ")} 👏`);
    }
}

/*
Where are you up to?
What are your queries about last week's questions?
Who is your favourite character so far and why
*/