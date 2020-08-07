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
        message.channel.startTyping();

        // Get a random cat image from thecatapi
        const url = await fetchReddit("dogs");

        const embed = new MessageEmbed({
            color: "#7289da",
            image: { url },
        });

        message.channel.stopTyping();
        message.channel.send({ embed });
    }
}
