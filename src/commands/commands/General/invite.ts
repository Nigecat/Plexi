import { Command } from "../../Command";
import { Plexi } from "../../../Plexi";
import { Message } from "discord.js";

export default class Invite extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "invite",
            group: "General",
            description: "Generate an invite link for adding me to a server",
        });
    }

    run(message: Message): void {
        message.channel.send(`
            https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=1043721343
        `);
    }
}
