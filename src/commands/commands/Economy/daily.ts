import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";

export default class Daily extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "daily",
            group: "Economy",
            description: "Claim your daily 50 coins",
        });
    }

    async run(message: Message): Promise<void> {
        const now = new Date();
        const user = await this.client.database.getUser(message.author.id);
        // If this user has claimed before
        if (user.dailyClaimTime) {
            // Add one day to their claim time then see if that date is before now
            user.dailyClaimTime.setDate(user.dailyClaimTime.getDate() + 1);
            if (user.dailyClaimTime < now) {
                message.channel.send("Daily coins successfully claimed!");
                this.client.database.updateUser(message.author.id, "dailyClaimTime", now);
                this.client.database.updateUser(message.author.id, "coins", user.coins + 50);
            } else {
                message.channel.send(
                    `Please wait ${
                        (BigInt(user.dailyClaimTime.valueOf()) - BigInt(now.valueOf())) / 1000n / 60n / 60n
                    } hours before you can claim again.`,
                );
            }
        } else {
            message.channel.send("You have claimed 50 coins! Run this command in 24 hours to get another 50.");
            this.client.database.updateUser(message.author.id, "dailyClaimTime", now);
            this.client.database.updateUser(message.author.id, "coins", user.coins + 50);
        }
    }
}
