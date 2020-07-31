import { Command } from "plexi/command";
import { PlexiClient } from "plexi/client";
import { Message } from "discord.js";

export default class EightBall extends Command {
    constructor(client: PlexiClient) {
        super(client, {
            name: "8b",
            description: "Ask the 8ball a question",
            args: [
                {
                    key: "question",
                    infinite: true
                }
            ]
        });
    }

    run(message: Message, { question }: { question: string }) {
        const responses = [
            "As I see it, yes.", "Ask again later.", "Better not tell you now.", "Cannot predict now.",
            "Concentrate and ask again.", "Don’t count on it.", "It is certain.", "It is decidedly so.",
            "Most likely.", "My reply is no.", "My sources say no.", "Outlook not so good.",
            "Outlook good.", "Reply hazy, try again.", "Signs point to yes.", "Very doubtful.",
            "Without a doubt.", "Yes.", "Yes – definitely", "You may rely on it."
        ];

        // Respond with a random response
        message.channel.send(`🎱** | ${message.author.username} asked:** ${question}\n🎱 **| Answer:** ${responses[Math.floor(Math.random() * responses.length)]}`, { allowedMentions: { roles: [], users: [] } });
    }
} 