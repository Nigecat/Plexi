import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { fetchReddit } from "../../../utils/misc";
import { Message, MessageEmbed } from "discord.js";

export default class Cat extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "dog",
            group: "Image",
            description: "Get a random dog image",
        });
    }

    async run(message: Message): Promise<void> {
        const url = await fetchReddit("dogs");

        const embed = new MessageEmbed({
            color: "RANDOM",
            image: { url },
        });

        message.channel.send({ embed });
    }
}
