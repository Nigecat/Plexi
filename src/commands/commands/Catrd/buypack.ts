import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { Message, MessageEmbed } from "discord.js";
import { Card } from "../../../managers/CardManager";
import packData from "../../../assets/cards/packs.json";

export default class BuyPack extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "buypack",
            group: "Catrd",
            description:
                "Buy a pack of cards, run packinfo to see available packs and their cost. You will recieved 5 cards from the pack.",
            args: [
                {
                    type: "string",
                    name: "pack",
                    oneOf: Object.keys(packData),
                    infinite: true,
                },
            ],
        });
    }

    async run(message: Message, [packSearch]: [string]): Promise<void> {
        // Figure out the correct case of the pack
        const pack = this.client.cards.find((card) => card.pack.toLowerCase() === packSearch.toLowerCase()).pack;
        const user = await this.client.database.getUser(message.author.id);
        // If this user has enough coins to buy this pack
        if (user.coins >= packData[pack].cost) {
            // Get a random selection of 5 cards from this pack and weight them based on rarity
            const cards = this.getPack(this.client.cards.array().filter((card) => card.pack === pack));

            // Remove the coins from the user's account
            await this.client.database.updateUser(message.author.id, "coins", user.coins - packData[pack].cost);

            // Add the cards to the user's cards
            await this.client.database.updateUser(
                message.author.id,
                "cards",
                user.cards.concat(cards.map((card) => card.name)),
            );

            const embed = new MessageEmbed({
                color: "RANDOM",
                title: `Bought pack: ${pack}`,
                footer: {
                    text: `You now have ${
                        user.coins - packData[pack].cost
                    } coins (run \`mycards\` to view the cards you have)`,
                },
                fields: [
                    {
                        name: "Got Cards:",
                        value: cards.map((card) => card.name).join("\n"),
                    },
                ],
            });
            message.channel.send({ embed });
        } else {
            message.channel.send(
                `You don't have enough coins to buy this pack (You have ${user.coins} and you need ${packData[pack].cost})!`,
            );
        }
    }

    /** Get a selection of 5 cards from an array of cards */
    getPack(cards: Card[]): Card[] {
        const pack = [];
        while (pack.length < 5) {
            const card = cards[Math.floor(Math.random() * cards.length)];
            // Rarity check
            if (card.rarity > Math.floor(Math.random() * 100) + 1) {
                pack.push(card);
            }
        }
        return pack;
    }
}
