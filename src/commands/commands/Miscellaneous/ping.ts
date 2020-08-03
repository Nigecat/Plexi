import { Message } from "discord.js";
import { oneLine } from "common-tags";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";

export default class Ping extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "ping",
            group: "Miscellaneous",
            description: "Check the bot's ping to the Discord server",
        });
    }

    async run(message: Message): Promise<void> {
        const pingMessage = await message.channel.send("Pinging...");
        pingMessage.edit(oneLine`
            Pong! The message round-trip took ${
                (pingMessage.editedTimestamp || pingMessage.createdTimestamp) -
                (message.editedTimestamp || message.createdTimestamp)
            }ms.
            The heartbeat ping is ${this.client.ws.ping}ms.
        `);
    }
}
