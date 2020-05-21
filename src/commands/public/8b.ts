import { Message } from "discord.js";

export default {
    args: "question",
    description: "Ask the 8 ball a question",
    call: function (message: Message, args: string): void {
        const responses: string[] = [
            "As I see it, yes.", "Ask again later.", "Better not tell you now.", "Cannot predict now.",
            "Concentrate and ask again.", "Don’t count on it.", "It is certain.", "It is decidedly so.",
            "Most likely.", "My reply is no.", "My sources say no.", "Outlook not so good.",
            "Outlook good.", "Reply hazy, try again.", "Signs point to yes.", "Very doubtful.",
            "Without a doubt.", "Yes.", "Yes – definitely", "You may rely on it."
        ];

        // Get user tag and remove the 4 digits after the hashtag then pick random element of response array
        message.channel.send(`🎱** | ${message.author.username} asked:** ${args}\n🎱 **| Answer:** ${responses[Math.floor(Math.random() * responses.length)]}`);
    }
}