import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import jokes from "../../../assets/json/jokes.json";

export default class Joke extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "joke",
            group: "Fun",
            description: "Get a random joke",
        });
    }

    run(message: Message): void {
        // Get a random joke
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        // So that we have a slight delay between the setup and punchline,
        //  send the punchline after the setup has finished sending
        message.channel.send(joke.setup).then(() => message.channel.send(joke.punchline));
    }
}
