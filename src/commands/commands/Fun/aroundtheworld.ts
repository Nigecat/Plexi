import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { stripIndents } from "common-tags";

export default class AroundTheWorld extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "aroundtheworld",
            group: "Fun",
            description: "Around the world",
        });
    }

    run(message: Message): void {
        message.channel.send(stripIndents`
            :arrow_upper_right::arrow_right::arrow_lower_right:
            :arrow_up::earth_asia::arrow_down:
            :arrow_upper_left::arrow_left::arrow_lower_left:
        `);
    }
}
