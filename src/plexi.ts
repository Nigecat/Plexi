import { Client, ClientOptions } from "discord.js";

/**
 * An extended version of the discord.js client
 * @param {ClientOptions} options - The options for the client
 */
export class Plexi extends Client {
    constructor(options: PlexiOptions = {}) {
        super(options.client);
    }
}

export interface PlexiOptions {
    client?: ClientOptions;
    plexi?: {
        supportServer?: string;
        owner?: string;
    };
}
