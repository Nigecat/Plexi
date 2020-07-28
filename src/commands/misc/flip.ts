import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Flip extends Command {
    constructor(client: Client) {
        super(client, {
            name: "flip",
            memberName: "flip",
            description: "Flip a coin",
            group: "misc"
        });
    }

    run(message: CommandoMessage) {
        return message.say(Math.floor(Math.random() * 2) == 0 ? "Heads" : "Tails");
    }
}