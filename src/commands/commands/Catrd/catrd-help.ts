import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { Message, MessageEmbed } from "discord.js";
import { stripIndents } from "common-tags";

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
                Get started by running the \`mycards\` command to view your cards.
                Run \`bal\` to view how many coins you have. 
                View the Economy section of the \`help\` command to see possible ways to get coins.
            `,
        });
        message.channel.send({ embed });
    }
}
