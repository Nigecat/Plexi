import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { stripIndents } from "common-tags";
import { Message, MessageEmbed } from "discord.js";

export default class CatrdHelp extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "catrd-help",
            group: "Catrd",
            description: "Run this command to see what catrd is and get an overview of how it works",
        });
    }

    run(message: Message): void {
        const embed = new MessageEmbed({
            color: "RANDOM",
            title: "Catrd: Its like Ryan Reynold’s Foolproof but better and a card game",
            description: stripIndents`
                What is catrd?
                It is a card game, but with cats! 
            `,
            fields: [
                {
                    name: "Each card has the following:",
                    value: stripIndents`
                        **pack** - This is the general category of the card. You can buy 5 random cards from a specific pack with \`buypack\`.
                        **type** (Melee | Defense | Scout) - This is the position the card gets played to on the board.
                        **value** - The value in coins that this card is worth, if you have this card it can be sold with \`sellcard\`.
                        **power** - The amount of power this card has in a duel (more is better!).
                        **rarity** - The rarity of this card, this affects the chance to get it to drop when you buy a pack.
                        **ability** - The ability of this card, run \`abilityinfo\` to check what an ability does. These only affect gameplay, not all cards will have one.
                        
                        Use the \`cardinfo\` command to get view this on a specific card (e.g \`cardinfo standard cat\`)
                    `,
                },
                {
                    name: "Getting started",
                    value: stripIndents`
                        Get sstarted by running the \`mycards\` command to view your cards.
                        Run \`bal\` to view how many coins you have. 
                        View the Economy section of the \`help\` command result to see possible ways to get coins (just try running some of the commands).
                    `,
                },
            ],
        });
        message.channel.send({ embed });
    }
}
