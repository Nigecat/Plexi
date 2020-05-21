import { Message, MessageEmbed } from "discord.js";
import fetch, { Response, RequestContext } from "node-fetch";

export default {
    description: "Get a random post from /r/cats",
    async call (message: Message): Promise<void> {
        // Get 1000 random posts from the subreddit's random.json
        const posts: Response = await fetch("https://www.reddit.com/r/cats/random.json?limit=1000");

        // Convert the posts to json data
        const data: any = (await posts.json()).data;

        // Pick a random post from the returned data
        const post: any = data.children[Math.floor(Math.random() * data.children.length)].data;

        const embed: MessageEmbed = new MessageEmbed()
            .setColor("#7289DA ")
            .setTitle(post.title)
            .setImage(post.url);

        message.channel.send({ embed });
    }
}