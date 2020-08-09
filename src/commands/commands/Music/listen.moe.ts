import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";

export default class ListenMoe extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "listen.moe",
            group: "Music",
            description: "Stream music from `https://listen.moe` into your current voice channel",
        });
    }

    async run(message: Message): Promise<void> {
        // Make sure the user is in a voice channel
        if (!message.member.voice.channel) {
            message.channel.send("You must be in a voice channel to run this command!");
            return;
        }

        await message.react(["👍", "👌"][Math.floor(Math.random() * 2)]);

        const connection = await message.member.voice.channel.join();
        connection.play("https://listen.moe/opus", {
            volume: false,
            highWaterMark: 50,
        });
    }
}
