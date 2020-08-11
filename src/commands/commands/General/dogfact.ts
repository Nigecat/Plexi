import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import dogfacts from "../../../assets/json/dogfacts.json";

export default class DogFact extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "dogfact",
            group: "General",
            description: "Get a random dog fact",
        });
    }

    run(message: Message): void {
        message.channel.send(dogfacts[Math.floor(Math.random() * dogfacts.length)]);
    }
}
