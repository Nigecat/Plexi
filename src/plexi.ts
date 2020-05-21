import Database from "./util/Database.js";
import log from "./util/logger.js";
import processCommand from "./commandHelper.js";
import { Guild, Message, Client } from "discord.js";
const client: Client = new Client();

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
        process.on("uncaughtException", err => log("error", err));
        process.on("UnhandledPromiseRejectionWarning", err => log("error", err));
        client.on("warn", err => log("error", err));
        client.on("error", err => log("error", err));
        client.on("ready", this.ready.bind(this));
        client.on("message", this.processMessage.bind(this));
        client.on("guildCreate", this.setStatus);
        client.on("guildDelete", this.setStatus);
        client.on("debug", info => log("debug", info));
        client.login(this.token);
    }

    /** Gets called when the client is ready */
    private ready(): void {
        log("ready", `Logged in as ${client.user.tag} serving ${client.users.cache.size} users across ${client.channels.cache.size} channels in ${client.guilds.cache.size} servers`);
        this.setStatus();
    }

    /** Update the bot's status */
    private setStatus(): void {
        client.user.setPresence({ activity: { type: "PLAYING", "name": `$help | ${client.guilds.cache.size} servers` }, status: "online" });
    }

    /** Process an incoming message */
    private processMessage(message: Message): void {
        if (!message.author.bot && message.guild) {
            processCommand(message, this.database, client, this.owner);
        }
    }
}