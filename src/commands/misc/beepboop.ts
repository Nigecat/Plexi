import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class BeepBoop extends Command {
    constructor(client: Client) {
        super(client, {
            name: "beepboop",
            group: "misc",
            memberName: "beepboop",
            description: "beepboop"
        });
    }

    run(message: CommandoMessage) {
        return message.say("beepboop");
    }
}