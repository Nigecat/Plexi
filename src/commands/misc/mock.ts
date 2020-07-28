import { MessageEmbed } from "discord.js";
import { lastMessage } from "../../util.js";
import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Mock extends Command {
    constructor(client: Client) {
        super(client, {
            name: "mock",
            memberName: "mock",
            group: "misc",
            description: "Mock the previous message"
        });
    }

    async run(message: CommandoMessage) {
        // Get the previous message, this is the message that we are mocking
        const msg = await lastMessage(message.channel);

        // Make the case of the target text random
        const mock = msg.content.split("").map(l => Math.floor((Math.random() * 2) + 1) === 1 ? l.toLowerCase() : l.toUpperCase()).join("");

        const embed = new MessageEmbed({
            color: "#7289DA",
            title: mock + " - " + msg.author.tag,
            files: ["src/resources/spongebob_mocking.png"],
            image: { url: "attachment://spongebob_mocking.png" }
        });

        return message.say(embed);
    }
}