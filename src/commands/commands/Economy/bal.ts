import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";

export default class Bal extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "bal",
            description: "Get your coin balance",
            group: "Economy",
        });
    }

    async run(message: Message): Promise<void> {
        const { coins } = await this.client.database.getUser(message.author.id);
        message.channel.send(`You have ${coins} coins!`);
    }
}
