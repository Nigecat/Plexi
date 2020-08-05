import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { fetch } from "../../../utils/misc";
import { Message, MessageEmbed } from "discord.js";

export default class Cat extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "cat",
            group: "Miscellaneous",
            description: "Get a random cat image",
        });
    }

    async run(message: Message): Promise<void> {
        message.channel.startTyping();

        // Get a random cat image from thecatapi
        const url = (await fetch("https://api.thecatapi.com/v1/images/search"))[0].url;

        const embed = new MessageEmbed({
            color: "#7289da",
            image: { url },
        });

        message.channel.stopTyping();
        message.channel.send({ embed });
    }
}
