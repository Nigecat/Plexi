import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import kaomoji from "../../../assets/json/kaomoji.json";

export default class Kaomoji extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "kaomoji",
            group: "Fun",
            description:
                "Display a random kaomoji! (´・ω・｀) 3000 will definitely be enough to keep you busy! (ｖ｀▽´)ｖ",
        });
    }

    run(message: Message): void {
        const face = kaomoji[Math.floor(Math.random() * kaomoji.length)];
        message.channel.send(face);
    }
}
