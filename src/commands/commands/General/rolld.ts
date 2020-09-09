import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { DiceRoll } from "rpg-dice-roller";

export default class RollD extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "rolld",
            aliases: ["rl"],
            description: "DND dice roll",
            group: "General",
            args: [
                {
                    name: "notation",
                    type: "string",
                    infinite: true,
                },
            ],
        });
    }

    run(message: Message, [notation]: [string]): void {
        try {
            message.channel.send(new DiceRoll(notation).output, { split: true });
        } catch {
            message.channel.send("I was unable to roll that.");
        }
    }
}
