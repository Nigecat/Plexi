import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import catfacts from "../../../assets/json/catfacts.json";

export default class CatFact extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "catfact",
            group: "Miscellaneous",
            description: "Get a random cat fact",
        });
    }

    run(message: Message): void {
        message.channel.send(catfacts[Math.floor(Math.random() * catfacts.length)]);
    }
}
