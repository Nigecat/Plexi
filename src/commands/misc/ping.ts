import { Command } from "plexi/command";
import { PlexiClient } from "plexi/client";
import { Message } from "discord.js";

export default class Ping extends Command {
    constructor(client: PlexiClient) {
        super(client, {
            name: "ping",
            description: "Ping the bot"
        });
    }

    async run(message: Message) {
        message.channel.send("pong!");
    }
}