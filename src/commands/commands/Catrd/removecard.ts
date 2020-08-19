import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";

export default class RemoveCard extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "removecard",
            group: "Catrd",
            description: "Remove a card from your deck (moves it to your cards), run `mycards` to view your cards/deck",
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

        // If the user has this card
        if (user.deck.map((card) => card.toLowerCase()).includes(card.toLowerCase())) {
            user.deck.splice(user.deck.map((card) => card.toLowerCase()).indexOf(card.toLowerCase()), 1);
            // Remove the card from their deck
            await this.client.database.updateUser(message.author.id, "deck", user.deck);

            // Add the card to their cards
            await this.client.database.updateUser(
                message.author.id,
                "cards",
                user.cards.concat([this.client.cards.get(card).name]),
            );
            message.channel.send(`${this.client.cards.get(card).name} has been removed from your deck!`);
        } else {
            message.channel.send("You don't have this card in your deck! Run `mycards` to view your cards");
        }
    }
}
