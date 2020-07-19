import chalk from "chalk";
import Database from "./models/database.js";
import { Client, Message } from "discord.js";
import processCommand from "./commandHelper.js";

export default class Plexi {
    client: Client;
    database: Database;

    constructor(private token: string, databasePath: string, public owner: string) {
        this.database = new Database(databasePath);

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
            processCommand(message, this.database, this.owner);
        }
    }
}