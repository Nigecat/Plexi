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

        // Get 1000 random posts from r/cats
        const posts = await fetch("https://www.reddit.com/r/cats/random.json?limit=1000");

        // Convert the posts to json data
        const data = (await posts.json()).data;

        // Pick a random post from the returned data
        const post = data.children[Math.floor(Math.random() * data.children.length)].data;

        const embed = new MessageEmbed({
            color: "#7289da",
            title: post.title,
            image: { url: post.url }
        });

        message.channel.stopTyping();
        return message.embed(embed);
    }
}