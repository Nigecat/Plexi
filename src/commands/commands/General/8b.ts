import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { stripIndents } from "common-tags";
import responses from "../../../assets/json/8b-responses.json";

export default class EightBall extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "8b",
            group: "General",
            description: "Ask the 8ball a question",
            args: [
                {
                    name: "question",
                    type: "string",
                    infinite: true,
                },
            ],
        });
    }

    run(message: Message, [question]: [string]): void {
        // Respond with a random response
        message.channel.send(stripIndents`
            🎱** | ${message.author.username} asked:** ${question}
            🎱 **| Answer:** ${responses[Math.floor(Math.random() * responses.length)]}`);
    }
}
