import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Roll extends Command {
    constructor(client: Client) {
        super(client, {
            name: "roll",
            memberName: "roll",
            group: "misc",
            description: "Get a random number (inclusive) between the two specified numbers",
            args: [
                {
                    key: "min",
                    prompt: "What is the minimum value?",
                    type: "integer"
                },
                {
                    key: "max",
                    prompt: "What is the maximum value?",
                    type: "integer"
                }
            ]
        });
    }

    run(message: CommandoMessage, { min, max }: { min: number, max: number }) {
        return message.say(Math.floor(Math.random() * (max - min + 1)) + min);
    }

}