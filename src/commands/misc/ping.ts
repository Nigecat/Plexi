import { Message } from "discord.js";
import { oneLine } from "common-tags";
import { Command } from "plexi/command";
import { PlexiClient } from "plexi/client";

export default class Ping extends Command {
    constructor(client: PlexiClient) {
        super(client, {
            name: "ping",
            description: "Check the bot's ping to the Discord server"
        });
    }

    async run(message: Message) {
        const pingMessage = await message.channel.send("Pinging...");
        pingMessage.edit(oneLine`
            Pong! The message round-trip took ${
                (pingMessage.editedTimestamp || pingMessage.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)
            }ms.
            The heartbeat ping is ${this.client.ws.ping}ms.
        `);
    }
}