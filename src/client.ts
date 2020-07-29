import * as Keyv from "keyv";
import { CommandoClient, CommandoClientOptions } from "discord.js-commando";

export class PlexiClient extends CommandoClient {
    constructor(options?: CommandoClientOptions) {
        super(options);
        this.data = {
            servers: {}
        };
    }

    data: {
        servers: {
            autoroles?: Keyv
        }
    }
}