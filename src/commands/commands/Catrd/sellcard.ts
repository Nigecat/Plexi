import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { stripIndents } from "common-tags";

export default class SellCard extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "sellcard",
            group: "Catrd",
            description: "Sell a card for it's value. Run `cardinfo` to check the value of a card.",
            args: [
                {
                    name: "card",
                    type: "string",
                    infinite: true,
                },
            ],
        });
    }

    async run(message: Message, [cardName]: [string]): Promise<void> {
        // If this card exists
        if (this.client.cards.has(cardName)) {
            const card = this.client.cards.get(cardName);
            const user = await this.client.database.getUser(message.author.id);
            // If this user has that card
            if (user.cards.includes(card.name)) {
                // Remove it and give them the coins
                message.channel.send(`You sold ${card.name} for ${card.value} coins!`);
                user.cards.splice(user.cards.indexOf(card.name), 1);
                await this.client.database.updateUser(message.author.id, "cards", user.cards);
                await this.client.database.updateUser(message.author.id, "coins", user.coins + card.value);
            } else {
                message.channel.send(stripIndents`
                    You can't sell a card you don't have!
                    Run \`mycards\` to view your cards.
                    (HINT: You can't sell a card in your deck)
                `);
            }
        } else {
            message.channel.send("That card does not exist!");
        }
    }
}
