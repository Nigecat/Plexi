import { Message } from "discord.js";
import { Command } from "plexi/command";
import { PlexiClient } from "plexi/client";

export default class Ping extends Command {
    constructor(client: PlexiClient) {
        super(client, {
            name: "ping",
            description: "Ping the bot"
        });
    }

    run(message: Message) {
        message.channel.send("pong");
    }
}