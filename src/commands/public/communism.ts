import { Message } from "discord.js";

export default {
    args: "text",
    description: "☭ Make text communist ☭",
    call (message: Message, args: string): void {
        const communism: object = {
            "my": "our",
            "i": "we",
            "me": "we",
            "your": "our",
            "you": "we",
            "any reason": "for the great communist nation"
        }

        message.channel.send(`☭ ${args.split(" ").map(word => {
            if (word in communism) return communism[word];
            return word;
        }).join(" ")} ☭`);
    }
}