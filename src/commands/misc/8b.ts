import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class EightBall extends Command {
    constructor(client: Client) {
        super(client, {
            name: "8b",
            memberName: "8b",
            group: "misc",
            description: "Ask the 8ball a question",
            args: [
                {
                    key: "question",
                    prompt: "What would you like to ask?",
                    type: "string"
                }
            ]
        });
    }

    run(message: CommandoMessage, { question }: { question: string }) {
        const responses = [
            "As I see it, yes.", "Ask again later.", "Better not tell you now.", "Cannot predict now.",
            "Concentrate and ask again.", "Don’t count on it.", "It is certain.", "It is decidedly so.",
            "Most likely.", "My reply is no.", "My sources say no.", "Outlook not so good.",
            "Outlook good.", "Reply hazy, try again.", "Signs point to yes.", "Very doubtful.",
            "Without a doubt.", "Yes.", "Yes – definitely", "You may rely on it."
        ];

        // Respond with a random response
        return message.say(`🎱** | ${message.author.username} asked:** ${question}\n🎱 **| Answer:** ${responses[Math.floor(Math.random() * responses.length)]}`);
    }
} 