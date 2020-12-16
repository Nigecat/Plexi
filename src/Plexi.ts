import plugins from "./plugins";
import loadCommands from "./commands";
import loadSlashCommands from "./slash";
import { Command } from "./commands/Command";
import { events, rawEvents } from "./events";
import CardManager from "./managers/CardManager";
import { SlashCommand } from "./slash/SlashCommand";
import DatabaseManager from "./managers/DatabaseManager";
import { Client, ClientOptions, Collection, ClientEvents, WSEventType } from "discord.js";

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

    /** The available cards to the client */
    public cards: CardManager;

    /** The commands this client has access to, mapped by their name */
    public commands: Collection<string, Command>;

    /** The slash commands this client has access to, mapped by their name */
    public slashCommands: Collection<string, SlashCommand>;

    /** A proxy object for accessing discord's api directly */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public discord: any;

    /** Create a new bot
     * @param {Options} options - The options for this client
     */
    constructor(options: Options) {
        super(options.client);
        this.config = options.plexi;

        // Due to the fact that the discord.js typing make the api object private
        // We must cast it to the any type before accessing it
        // This is why we assign it to another object within our own class so we don't have to do this cast everytime we access it
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.discord = (this as any).api;

        this.on("ready", this.init.bind(this));
        process.on("SIGTERM", () => {
            if (this.database) this.database.disconnect();
            this.destroy();
        });
    }

    /** Init the bot, this runs after we have connected to the gateway */
    async init(): Promise<void> {
        this.cards = new CardManager();

        // Do database setup if we got a uri
        if (process.env.DATABASE_URI) {
            // Connect to the database
            this.database = new DatabaseManager(this, process.env.DATABASE_URI);
            await this.database.init();
        }

        // Load our commands
        this.commands = await loadCommands(this);

        // Load our slash commands
        this.slashCommands = await loadSlashCommands(this);

        // Register our event handlers
        Object.keys(events).forEach((event) => {
            this.on(event as keyof ClientEvents, (...data) => events[event](this, data));
        });

        // Register our raw event handlers
        Object.keys(rawEvents).forEach((event) => {
            this.ws.on(event as WSEventType, (data) => rawEvents[event](this, data));
        });

        // Load our plugins
        plugins.forEach((plugin) => plugin(this));
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
    /** The id of the bot's dev server */
    devServerId?: string;
    /** The id of the bot owner */
    owner?: string;
    /** The default prefix for the bot */
    prefix: string;
    /** The current version of the bot */
    version?: string;
    /** An invite link for the bot */
    invite?: string;
}
