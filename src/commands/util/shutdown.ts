import { Command } from "plexi/command";
import { PlexiClient } from "plexi/client";

export default class Shutdown extends Command {
    constructor(client: PlexiClient) {
        super(client, {
            name: "shutdown",
            description: "Shutdown the bot",
            ownerOnly: true
        });
    }

    async run() {
        await this.client.data.prefixes.disconnect();
        this.client.destroy();
        process.exit();
    }
}
