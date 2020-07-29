import DataStore from "./datastore.js";
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
            autoroles?: DataStore
        }
    }
}