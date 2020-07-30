import { Client, ClientOptions } from "discord.js";

export class PlexiClient extends Client {
    public readonly defaultPrefix: string;

    constructor(options: PlexiOptions) {
        const defaultPrefix = options.defaultPrefix;
        delete options.defaultPrefix;
        super(options);
        this.defaultPrefix = defaultPrefix;
    }
}

export interface PlexiOptions extends ClientOptions {
    defaultPrefix: string
}   