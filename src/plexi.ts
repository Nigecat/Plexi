import { Client, ClientOptions } from "discord.js";

/**
 * An extended version of the discord.js client
 * @param {ClientOptions} options - The options for the client
 */
export class Plexi extends Client {
    /** The options for this client */
    public readonly config: PlexiOptions;

    /** Create a new bot
     * @param {Options} options - The options for this client
     */
    constructor(options: Options = {}) {
        super(options.client);
        this.config = options.plexi;
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
}
