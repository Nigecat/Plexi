import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";

export default class CoinFlip extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "coinflip",
            group: "General",
            description: "Flip a coin",
        });
    }

    run(message: Message): void {
        message.channel.send(Math.floor(Math.random() * 2) === 0 ? "Heads" : "Tails");
    }
}
