import Database from "./util/Database.js";
import log from "./util/logger.js";
import processCommand from "./commandHelper.js";
import { Message, Client, GuildMember, Role } from "discord.js";
import Server from "./util/Server.js";
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
        client.on("guildMemberAdd", this.autoRole.bind(this));
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

    /** Autorole handler */
    private async autoRole(member: GuildMember): Promise<void> {
        const server: Server = new Server(member.guild.id, this.database)
        await server.init();
        if (server.autorole !== "") {
            const role: Role = await member.guild.roles.fetch(server.autorole);
            member.roles.add(role).catch(console.error);
            log("status", `Applying autorole  [${role.name}]  to ${member.user.tag} in ${member.guild.name}`);
        }
    }

    /** Process an incoming message */
    private processMessage(message: Message): void {
        if (!message.author.bot && message.guild) {
            processCommand(message, this.database, client, this.owner);
        }
    }
}