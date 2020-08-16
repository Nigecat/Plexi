import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";

export default class AddCard extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "addcard",
            group: "Catrd",
            description: "Move a card from your cards to your deck, run `mycards` to view your cards/deck",
            args: [
                {
                    name: "card",
                    type: "string",
                    infinite: true,
                },
            ],
        });
    }

    async run(message: Message, [card]: [string]): Promise<void> {
        const user = await this.client.database.getUser(message.author.id);

        // If we have too many cards
        if (user.deck.length >= 20) {
            message.channel.send(
                "You have 20 cards in your deck! This is the max size, remove some with `removecard <card>` to add more.",
            );
            return;
        }

        // If the user has this card
        if (user.cards.map((card) => card.toLowerCase()).includes(card.toLowerCase())) {
            user.cards.splice(user.cards.map((card) => card.toLowerCase()).indexOf(card.toLowerCase()), 1);
            // Remove the card from their cards
            await this.client.database.updateUser(message.author.id, "cards", user.cards);

            // Add the card to their deck
            await this.client.database.updateUser(
                message.author.id,
                "deck",
                user.deck.concat([this.client.cards.get(card).name]),
            );
            message.channel.send(`${this.client.cards.get(card).name} has been moved to your deck!`);
        } else {
            message.channel.send("You don't have this card! Run `mycards` to view your cards");
        }
    }
}
