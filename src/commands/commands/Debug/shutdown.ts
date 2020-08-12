import { Command } from "../../Command";
import { Plexi } from "../../../Plexi";

export default class Shutdown extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "shutdown",
            description: "Shutdown the bot and disconnect from the gateway",
            group: "Debug",
            ownerOwnly: true,
            hidden: true,
        });
    }

    async run(): Promise<void> {
        this.client.destroy();
        await this.client.database.disconnect();
        process.exit(0);
    }
}
