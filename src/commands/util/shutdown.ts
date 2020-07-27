import { Command, Client } from "discord.js-commando";

export default class ShutDown extends Command {
    constructor(client: Client) {
        super(client, {
            name: "shutdown",
            memberName: "shutdown",
            description: "Shutdown the bot",
            group: "util",
            ownerOnly: true
        });
    }

    async run() {
        this.client.destroy();
        process.exit();
        return Promise.resolve(undefined);
    }
}