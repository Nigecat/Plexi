import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { Message, MessageEmbed } from "discord.js";

export default class TopCoins extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "topcoins",
            group: "Economy",
            description: "View the global top leaderboard for coins",
        });
    }

    async run(message: Message): Promise<void> {
        const users = await this.client.database.allUsers();
        users.sort((a, b) => b.coins - a.coins);

        const embed = new MessageEmbed({
            title: "Global leaderboard for coins",
            color: "RANDOM",
        });

        // Get the top 10 users for the display
        users.slice(0, 10).forEach((user, i) => {
            embed.addField(`${i + 1}. ${this.client.users.cache.get(user.id).username}`, `\t${user.coins} coins`);
        });

        message.channel.send({ embed });
    }
}
