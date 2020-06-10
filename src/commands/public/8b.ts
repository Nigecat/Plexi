import { Message } from "discord.js";
import Command from "../../util/Command.js";

export default Command.create({
    args: "question",
    description: "Ask the 8 ball a question",
    call (message: Message, args: string): void {
        const responses: string[] = [
            "As I see it, yes.", "Ask again later.", "Better not tell you now.", "Cannot predict now.",
            "Concentrate and ask again.", "Don’t count on it.", "It is certain.", "It is decidedly so.",
            "Most likely.", "My reply is no.", "My sources say no.", "Outlook not so good.",
            "Outlook good.", "Reply hazy, try again.", "Signs point to yes.", "Very doubtful.",
            "Without a doubt.", "Yes.", "Yes – definitely", "You may rely on it."
        ];

        if (message.content.toLowerCase().includes("traps") && message.content.toLowerCase().includes("gay")) {
            message.channel.send(`🎱** | ${message.author.username} asked:** ${args}\n🎱 **| Answer:** no`);
        } else if (message.content.toLowerCase().includes("nigel")) {
            message.channel.send({ files: [ "./commands/resources/classified.jpg" ] });
        } else {
            // Get user tag and remove the 4 digits after the hashtag then pick random element of response array
            message.channel.send(`🎱** | ${message.author.username} asked:** ${args}\n🎱 **| Answer:** ${responses[Math.floor(Math.random() * responses.length)]}`);
        
        }
    }
});