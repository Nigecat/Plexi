import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { stripIndents } from "common-tags";

export default class CardChance extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "cardchance",
            group: "Debug",
            description:
                "Check what your chance of drawing a specific card is from buying a deck (this is a rough approximation)",
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
            const averages = [];
            for (let i = 0; i < 10000; i++) {
                let x = 0;
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    if (card.rarity > Math.floor(Math.random() * 100) + 1) {
                        averages.push(x);
                        break;
                    }
                    x++;
                    // Abort if we haven't gotten a card after 1k attempts
                    if (x > 1000) {
                        averages.push(0);
                        break;
                    }
                }
            }

            const average = averages.reduce((a, b) => a + b) / averages.length;

            message.channel.send(stripIndents`
                It took me an average of ${average} cards to get this card.
                If divide by 5 that gives us an average of ${average / 5} packs to obtain this card.
            `);
        } else {
            message.channel.send("I could not find that card");
        }
    }
}
