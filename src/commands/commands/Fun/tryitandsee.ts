import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";

export default class TryItAndSee extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "tryitandsee",
            group: "Fun",
        });
    }

    run(message: Message): void {
        message.channel.send("https://tryitands.ee/");
    }
}
