import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { stripIndents } from "common-tags";

export default class EightBall extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "8b",
            group: "misc",
            description: "Ask the 8ball a question",
            args: [{ name: "question", type: "string", infinite: true }],
        });
    }

    run(message: Message, [question]: [string]): void {
        const responses = [
            "As I see it, yes.",
            "Ask again later.",
            "Better not tell you now.",
            "Cannot predict now.",
            "Concentrate and ask again.",
            "Don’t count on it.",
            "It is certain.",
            "It is decidedly so.",
            "Most likely.",
            "My reply is no.",
            "My sources say no.",
            "Outlook not so good.",
            "Outlook good.",
            "Reply hazy, try again.",
            "Signs point to yes.",
            "Very doubtful.",
            "Without a doubt.",
            "Yes.",
            "Yes – definitely",
            "You may rely on it.",
        ];

        // Respond with a random response
        message.channel.send(stripIndents`
            🎱** | ${message.author.username} asked:** ${question}
            🎱 **| Answer:** ${responses[Math.floor(Math.random() * responses.length)]}`);
    }
}
