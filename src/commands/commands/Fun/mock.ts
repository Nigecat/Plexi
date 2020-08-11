import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { MessageEmbed, Message } from "discord.js";
import { lastMessage } from "../../../utils/misc";

export default class Mock extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "mock",
            group: "Fun",
            description: "Mock the previous message",
        });
    }

    async run(message: Message): Promise<void> {
        // Get the previous message, this is the message that we are mocking
        const msg = await lastMessage(message.channel);

        // Make the case of the target text random
        const mock = msg.content
            .split("")
            .map((l) => (Math.floor(Math.random() * 2 + 1) === 1 ? l.toLowerCase() : l.toUpperCase()))
            .join("");

        const embed = new MessageEmbed({
            color: "#7289DA",
            title: `${mock} - ${msg.author.tag}`,
            files: ["src/assets/spongebob_mocking.png"],
            image: { url: "attachment://spongebob_mocking.png" },
        });

        message.channel.send({ embed });
    }
}
