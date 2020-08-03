import events from "./events";
import { generateRegExp } from "./utils/misc";
import { Client, ClientOptions } from "discord.js";
import PrefixManager from "./managers/PrefixManager";

/**
 * An extended version of the discord.js client
 * @param {ClientOptions} options - The options for the client
 */
export class Plexi extends Client {
    /** The options for this client */
    public readonly config: PlexiOptions;

    /** The prefix manager for this client.
     *  NOTE: This is only created if the databasePath config option is specified.
     */
    public prefixes: PrefixManager;

    /** This is the default prefix used for responding to messages,
     *  it is dynamically generated based on the config and the client id. */
    public defaultPrefix: RegExp;

    /** Create a new bot
     * @param {Options} options - The options for this client
     */
    constructor(options: Options) {
        super(options.client);
        this.config = options.plexi;

        this.on("ready", this.init.bind(this));
    }

    /** Init the bot, this runs after we have connected to the gateway */
    init(): void {
        // Generate the regex for the supplied prefix
        this.defaultPrefix = generateRegExp(this.config.prefix, this.user.id);

        // Create our prefix manager (only if we have a database)
        if (this.config.databasePath) {
            this.prefixes = new PrefixManager(this);
        }

        // Register our event handlers
        Object.keys(events).forEach((event) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.on(event as any, (data) => events[event](data, this));
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
    /** The id of the bot support server */
    supportServer?: string;
    /** The id of the bot owner */
    owner?: string;
    /** The path of the database to store persistant data in */
    databasePath?: string;
    /** The default prefix for the bot */
    prefix: string;
}
