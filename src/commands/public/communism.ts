import { Command, CommandData, InvalidArgument } from "../../types.js";

export default {
    description: "Communism /ˈkɒmjʊnɪz(ə)m/",
    args: ["[text]"],
    call({ message, args }: CommandData) {
        if (args.length === 0) throw new InvalidArgument();

        const communism = {
            "my": "our",
            "i": "we",
            "me": "we",
            "your": "our",
            "you": "we",
            "any reason": "for the great communist nation"
        };

        message.channel.send("☭ " + args.map(word => word in communism ? communism[word] : word).join(" ") + " ☭");
    }
} as Command