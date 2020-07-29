import { PlexiClient } from "../../client";
import { Command, Client } from "discord.js-commando";

export default class ShutDown extends Command {
    constructor(client: Client) {
        super(client, {
            name: "shutdown",
            memberName: "shutdown",
            description: "Shutdown the bot",
            group: "util",
            guarded: true,
            ownerOnly: true,
            hidden: true
        });
    }

    async run() {
        await (this.client as PlexiClient).data.servers.autoroles.disconnect();
        this.client.destroy();
        process.exit();
        return Promise.resolve(undefined);
    }
}