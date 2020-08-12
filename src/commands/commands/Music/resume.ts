import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";

export default class Resume extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "resume",
            aliases: ["unpause"],
            description: "Resume (unpause) the currently playing song",
            group: "Music",
        });
    }

    run(message: Message): void {
        if (
            message.guild.me.voice.channel &&
            message.member.voice.channel &&
            message.guild.me.voice.channel.id === message.member.voice.channel.id
        ) {
            message.react(["👍", "👌"][Math.floor(Math.random() * 2)]);
            message.guild.me.voice.connection.dispatcher.resume();
        } else {
            message.channel.send("You aren't in a voice channel with me!");
        }
    }
}
