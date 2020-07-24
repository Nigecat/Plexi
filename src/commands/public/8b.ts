import { Command, CommandData } from "../../types.js";

export default {
    description: "Ask the 8 ball a question",
    args: ["[text]"],
    call({ message, args }: CommandData) {
        const responses = [
            "As I see it, yes.", "Ask again later.", "Better not tell you now.", "Cannot predict now.",
            "Concentrate and ask again.", "Don’t count on it.", "It is certain.", "It is decidedly so.",
            "Most likely.", "My reply is no.", "My sources say no.", "Outlook not so good.",
            "Outlook good.", "Reply hazy, try again.", "Signs point to yes.", "Very doubtful.",
            "Without a doubt.", "Yes.", "Yes – definitely", "You may rely on it."
        ];

         // Pick random element of response array as the response
         message.channel.send(`🎱** | ${message.author.username} asked:** ${args}\n🎱 **| Answer:** ${responses[Math.floor(Math.random() * responses.length)]}`);
    }
} as Command
