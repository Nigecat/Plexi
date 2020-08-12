import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";

export default class Summon extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "summon",
            group: "Music",
            guildOnly: true,
            aliases: ["connect"],
            description: "Summon the bot into your voice channel",
            userPermissions: ["SPEAK"],
            clientPermissions: ["CONNECT"],
        });
    }

    run(message: Message): void {
        if (message.member.voice.channel) {
            message.member.voice.channel.join();
        } else {
            message.channel.send("You aren't in a voice channel!");
        }
    }
}
