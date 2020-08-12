import events from "./events";
import loadCommands from "./commands";
import { Command } from "./commands/Command";
import DatabaseManager from "./managers/DatabaseManager";
import { Client, ClientOptions, Collection } from "discord.js";

/**
 * An extended version of the discord.js client
 * @param {ClientOptions} options - The options for the client
 */
export class Plexi extends Client {
    /** The options for this client */
    public readonly config: PlexiOptions;

    /** The database manager for this client.
     *  NOTE: This is only created if the process.env.DATABASE_URI environment variable option is set.
     */
    public database: DatabaseManager;

    /** The commands this client has access to, mapped by their name */
    public commands: Collection<string, Command>;

    /** Create a new bot
     * @param {Options} options - The options for this client
     */
    constructor(options: Options) {
        super(options.client);
        this.config = options.plexi;

        this.on("ready", this.init.bind(this));
    }

    /** Init the bot, this runs after we have connected to the gateway */
    async init(): Promise<void> {
        // Do database setup if we got a uri
        if (process.env.DATABASE_URI) {
            // Connect to the database
            this.database = new DatabaseManager(this, process.env.DATABASE_URI);
            await this.database.init();
        }

        // Load our commands
        this.commands = await loadCommands(this);

        // Register our event handlers
        Object.keys(events).forEach((event) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.on(event as any, (...data) => events[event](this, data));
        });
    }
}

/** The options for this client */
export interface Options {
    /** These options get passed onto the underlying discord.js [Client]{@link https://discord.js.org/#/docs/main/stable/class/Client}.
     *  Must be a valid [ClientOptions]{@link https://discord.js.org/#/docs/main/stable/typedef/ClientOptions} object.
     */
    client?: ClientOptions;
    /** These are the options specific to our extended client */
    plexi?: PlexiOptions;
}

/** The options specific to our client */
export interface PlexiOptions {
    /** An invite link to the bot's support server */
    supportServer?: string;
    /** The id of the bot owner */
    owner?: string;
    /** The default prefix for the bot */
    prefix: string;
    /** The current version of the bot */
    version?: string;
}
