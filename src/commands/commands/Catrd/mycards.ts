import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { Message, MessageEmbed } from "discord.js";
import { ZERO_WIDTH_SPACE } from "../../../constants";

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
            const cards = [{ name: "Cards", value: "|", inline: true }];
            user.cards.forEach((card) => {
                if (cards[cards.length - 1].value.length >= 750) {
                    cards.push({ name: ZERO_WIDTH_SPACE, value: "|", inline: false });
                }
                cards[cards.length - 1].value += card + "\n";
            });

            const embed = new MessageEmbed({
                color: "RANDOM",
                title: "Your cards:",
                footer: { text: `Run \`duel\` to fight another user with your deck (Deck: [${user.deck.length}/20])` },
                fields: cards.concat([
                    {
                        name: "\u200b",
                        value: "\u200b",
                        inline: true,
                    },
                    {
                        name: "Deck",
                        value:
                            user.deck.join("\n") ||
                            "Your deck is empty! Run `addcard <card>` to move a card from your cards to your deck",
                        inline: true,
                    },
                ]),
            });
            message.channel.send({ embed });
        }
    }
}
