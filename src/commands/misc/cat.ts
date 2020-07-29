import fetch from "node-fetch";
import { Command, Client, CommandoMessage } from "discord.js-commando";
import { MessageEmbed } from "discord.js";

export default class Cat extends Command {
    constructor(client: Client) {
        super(client, {
            name: "cat",
            memberName: "cat",
            group: "misc",
            description: "Get a random cat image"
        });
    }

    async run(message: CommandoMessage) {
        message.channel.startTyping();

        // Get a random cat image from the cat api
        const data = await fetch("https://api.thecatapi.com/v1/images/search");

        const url = (await data.json())[0].url;

        const embed = new MessageEmbed({
            color: "#7289da",
            image: { url }
        });

        message.channel.stopTyping();
        return message.embed(embed);
    }
}