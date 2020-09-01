import { extname } from "path";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { ZERO_WIDTH_SPACE } from "../../../constants";
import { Message, MessageEmbed, MessageAttachment } from "discord.js";

export default class CardInfo extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "cardinfo",
            group: "Catrd",
            description: "Get info on the specified card",
            args: [
                {
                    name: "card",
                    type: "string",
                    infinite: true,
                },
            ],
        });
    }

    run(message: Message, [cardSearch]: [string]): void {
        if (this.client.cards.has(cardSearch)) {
            const card = this.client.cards.get(cardSearch);
            const image = new MessageAttachment(card.image, `card.${extname(card.image)}`);
            const embed = new MessageEmbed({
                color: "RANDOM",
                title: card.name,
                files: [image],
                image: { url: `attachment://card.${extname(card.image)}` },
                fields: [
                    {
                        name: "Pack",
                        value: card.pack,
                        inline: true,
                    },
                    {
                        name: "Type",
                        value: card.type,
                        inline: true,
                    },
                    {
                        name: "Value",
                        value: `${card.value} coins`,
                        inline: true,
                    },
                    {
                        name: ZERO_WIDTH_SPACE,
                        value: ZERO_WIDTH_SPACE,
                    },
                    {
                        name: "Power",
                        value: card.power,
                        inline: true,
                    },
                    {
                        name: "Rarity",
                        value: card.rarity,
                        inline: true,
                    },
                    {
                        name: "Ability",
                        value: card.ability ? card.ability.name : "None",
                        inline: true,
                    },
                ],
            });

            message.channel.send({ embed });
        } else {
            message.channel.send("I could not find that card");
        }
    }
}
