import chalk from "chalk";
import { Client, Message } from "discord.js";

export default class Plexi {
    client: Client;

    constructor(private token: string) {
        this.client = new Client({ presence: { status: "online", activity: { type: "PLAYING", name: "$help" } } });
        this.client.on("debug", console.log);
        this.client.on("message", this.processMessage.bind(this));
        this.client.on("ready", () => { console.log(chalk.greenBright(`Logged in as ${this.client.user.tag}`)) });
    }

    /** Start the bot */
    start() {
        this.client.login(this.token);
    }

    /** Process an incoming message */
    private processMessage(message: Message) {
        // Prevent the bot from responding to other bots and in dm channels
        if (!message.author.bot && message.guild) {
            console.log(message.content);
        }
    }
}