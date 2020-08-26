import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { Message } from "discord.js";

export default class R extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "r",
            description: "Run stuff after a reload",
            ownerOwnly: true,
            group: "Debug",
            hidden: true,
            args: [
                {
                    name: "data",
                    type: "string",
                    infinite: true,
                },
            ],
        });
    }

    async run(message: Message, [data]: [string]): Promise<void> {
        // Get this server's prefix
        const prefixRaw =
            message.guild && this.client.database
                ? (await this.client.database.getGuild(message.guild.id)).prefix
                : this.client.config.prefix;

        // Run the reload command
        await this.client.commands.get("reload").run(message);

        // Send this off as a normal event
        message.content = prefixRaw + data;
        this.client.emit("message", message);
    }
}
