import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";

export default class Leave extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "leave",
            group: "Music",
            guildOnly: true,
            description: "Make the bot leave it's current voice channel (you must be in the channel with it)",
            userPermissions: ["MOVE_MEMBERS", "SPEAK"],
        });
    }

    run(message: Message): void {
        if (message.guild.me.voice && message.guild.me.voice.channel.id === message.member.voice.channel.id) {
            message.guild.me.voice.channel.leave();
        } else {
            message.channel.send("You aren't in a voice channel with me!");
        }
    }
}
