import { Message } from "discord.js";
import { Command } from "plexi/command";
import { PlexiClient } from "plexi/client";

export default class BeepBoop extends Command {
    constructor(client: PlexiClient) {
        super(client, {
            name: "beepboop",
            description: "beepboop"
        });
    }

    run(message: Message) {
        message.channel.send("beepboop");
    }
}