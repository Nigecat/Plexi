import { Client, ClientOptions } from "discord.js";

export class PlexiClient extends Client {
    constructor(options: ClientOptions) {
        super(options);
    }
}