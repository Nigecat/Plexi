import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { Message, MessageEmbed } from "discord.js";

export default class MyCards extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "mycards",
            description: "View a list of the cards you currently have (and your deck)",
            group: "Catrd",
        });
    }

    async run(message: Message): Promise<void> {
        const user = await this.client.database.getUser(message.author.id);

        // If the user has no cards or deck
        if (user.cards.length === 0 && user.deck.length === 0) {
            message.channel.send("You don't have any cards! Run `packinfo` to get started.");
        } else {
            const embed = new MessageEmbed({
                color: "RANDOM",
                title: "Your cards:",
                footer: { text: `Run \`duel\` to fight another user with your deck (Deck: [${user.deck.length}/20])` },
                fields: [
                    {
                        name: "Cards",
                        value: user.cards.join("\n") || "You don't have any cards! Run `buypack` to get some",
                        inline: true,
                    },
                    {
                        name: "\u200b",
                        value: "\u200b",
                    },
                    {
                        name: "Deck",
                        value:
                            user.deck.join("\n") ||
                            "Your deck is empty! Run `addcard <card>` to move a card from your cards to your deck",
                        inline: true,
                    },
                ],
            });
            message.channel.send({ embed });
        }
    }
}
