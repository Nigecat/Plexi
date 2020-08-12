import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { Message, User } from "discord.js";

export default class Give extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "give",
            description: "Give a user some of your coins",
            group: "Economy",
            args: [
                {
                    name: "user",
                    type: "user",
                },
                {
                    name: "coins",
                    type: "number",
                },
            ],
        });
    }

    async run(message: Message, [user, coins]: [User, number]): Promise<void> {
        const destination = await this.client.database.getUser(user.id);
        const origin = await this.client.database.getUser(message.author.id);

        // If they have enough coins to do this
        if (origin.coins - coins > 0) {
            await this.client.database.updateUser(user.id, "coins", destination.coins + coins);
            await this.client.database.updateUser(message.author.id, "coins", origin.coins - coins);
            message.channel.send(`${coins} coins transfered from ${message.author} -> ${user}`, {
                disableMentions: "everyone",
            });
        } else {
            message.channel.send("You do not have enough coins to do that!");
        }
    }
}
