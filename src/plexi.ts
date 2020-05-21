import { logGreen, logRed } from "./util/colour.js";
import Discord, { Guild } from "discord.js";
const client = new Discord.Client();

export default class Plexi {
    private token: string;
    public owner: string;
    
    public constructor(token: string, owner: string) {
        this.token = token;
        this.owner = owner;
    }

    /** Start the bot */
    public start(): void {
        process.on("uncaughtException", logRed);
        client.on("warn", logRed);
        client.on("error", logRed);
        client.on("ready", this.ready.bind(this));
        client.on("guildCreate", this.serverUpdate.bind(this));
        client.on("guildDelete", this.serverUpdate.bind(this));
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

    /** Gets triggered when the bot leaves or joins a server */
    serverUpdate(server: Guild): void {
        this.setStatus();
    }
}