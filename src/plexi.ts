import Database from "./util/Database.js";
import { logGreen, logRed } from "./util/colour.js";
import processCommand from "./commandHelper.js";
import Discord, { Guild, Message } from "discord.js";
const client = new Discord.Client();

export default class Plexi {
    private token: string;
    public owner: string;
    private database: Database;

    public constructor(token: string, owner: string, databasePath: string) {
        this.token = token;
        this.owner = owner;
        this.database = new Database(databasePath);
    }

    /** Start the bot */
    public start(): void {
        process.on("uncaughtException", logRed);
        process.on("UnhandledPromiseRejectionWarning", logRed);
        client.on("warn", logRed);
        client.on("error", logRed);
        client.on("ready", this.ready.bind(this));
        client.on("message", this.processMessage.bind(this));
        client.on("guildCreate", this.setStatus);
        client.on("guildDelete", this.setStatus);
        client.on("debug", console.log);
        client.login(this.token);
    }

    /** Gets called when the client is ready */
    private ready(): void {
        logGreen(`Logged in as ${client.user.tag} serving ${client.users.cache.size} users across ${client.channels.cache.size} channels in ${client.guilds.cache.size} servers`);
        this.setStatus();
    }

    /** Update the bot's status */
    private setStatus(): void {
        client.user.setPresence({ activity: { type: "PLAYING", "name": `$help | ${client.guilds.cache.size} servers` }, status: "online" });
    }

    /** Process an incoming message */
    private processMessage(message: Message): void {
        if (!message.author.bot && message.guild) {
            processCommand(message, this.database, client);
        }
    }
}