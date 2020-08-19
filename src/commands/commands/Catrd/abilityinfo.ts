import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { Message, MessageEmbed } from "discord.js";

export default class AbilityInfo extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "abilityinfo",
            description: "Get info on a card ability",
            group: "Catrd",
            args: [
                {
                    name: "ability",
                    type: "string",
                    infinite: true,
                },
            ],
        });
    }

    run(message: Message, [ability]: [string]): void {
        // Get all cards with an ability
        const cards = this.client.cards.array().filter((card) => typeof card.ability !== "undefined");

        // If this ability exists
        if (cards.some((card) => card.ability.name.toLowerCase() === ability)) {
            const card = cards.find((card) => card.ability.name.toLowerCase() === ability);
            const embed = new MessageEmbed({
                color: "RANDOM",
                title: card.ability.name,
                description: card.ability.description,
            });
            message.channel.send({ embed });
        } else {
            message.channel.send("That ability does not exist!");
        }
    }
}
