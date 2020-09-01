import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { Message, MessageEmbed } from "discord.js";
import packData from "../../../assets/cards/packs.json";

export default class PackInfo extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "packinfo",
            group: "Catrd",
            description:
                "Get a list of cards in the specified pack, if no pack is specified it will show an overview of all packs.",
            args: [
                {
                    name: "pack",
                    type: "string",
                    default: "ALL",
                    infinite: true,
                },
            ],
        });
    }

    run(message: Message, [pack]: [string]): void {
        // If we are showing a general overview of the packs
        if (pack === "ALL") {
            const packs = [...new Set(this.client.cards.map((card) => card.pack))];
            const embed = new MessageEmbed({
                title: "All Packs",
                color: "RANDOM",
                fields: [
                    {
                        name: "Packs",
                        value: packs.map(
                            (pack) => `${pack} - ${packData[pack].description} (${packData[pack].cost} coins)`,
                        ),
                    },
                ],
                footer: {
                    text: "Run buypack <pack> to buy a pack for the specified number of coins, you will get 5 cards.",
                },
            });
            message.channel.send({ embed });
        } else {
            // Get any cards that match this pack
            const cards = this.client.cards.array().filter((card) => card.pack.toLowerCase() === pack.toLowerCase());
            // If we found any cards
            if (cards.length > 0) {
                const embed = new MessageEmbed({
                    title: `Pack: ${cards[0].pack} (${packData[cards[0].pack].cost} coins)`,
                    color: "RANDOM",
                    description: packData[cards[0].pack].description,
                    fields: [
                        {
                            name: "Cards",
                            value: cards.map((card) => card.name).join("\n"),
                        },
                    ],
                    footer: { text: "Run cardinfo <card> for more info on a specific card" },
                });
                message.channel.send({ embed });
            } else {
                message.channel.send(
                    "A pack with that name could not be found, run this command without specifying a pack to see avaiable packs.",
                );
            }
        }
    }
}
