import ytdl from "ytdl-core-discord";
import { Plexi } from "../../../Plexi";
import { YouTube, Video } from "popyt";
import { Command } from "../../Command";
import { Message, VoiceState } from "discord.js";

export default class BoomBox extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "boombox",
            group: "Music",
            description: "Play music and follow around the command runner",
            guildOnly: true,
            hidden: true,
            whitelist: ["508826294901932062", "307429254017056769"],
            args: [
                {
                    name: "search",
                    type: "string",
                    infinite: true,
                    default: "https://youtu.be/ihl4iHN2Ni4",
                },
            ],
        });
    }

    async run(message: Message, [search]: [string]): Promise<void> {
        // Make sure the user is in a voice channel
        if (!message.member.voice.channel) {
            message.channel.send("You must be in a voice channel to run this command!");
            return;
        }

        let video: Video;
        const youtube = new YouTube(process.env.YOUTUBE_TOKEN);
        try {
            video = await youtube.getVideo(search);
        } catch {
            return;
        }

        const url = `https://www.youtube.com/watch?v=${video.data.id}`;

        // Detect when the message author changes voice channels and follow them
        function listenerFunc(oldState: VoiceState, newState: VoiceState) {
            if (
                newState.channel &&
                newState.member.id === message.author.id &&
                (!oldState.channel || oldState.channel.id !== newState.channel.id)
            ) {
                newState.channel.join();
            }
        }

        this.client.on("voiceStateUpdate", listenerFunc);

        const connection = await message.member.voice.channel.join();

        const dispatcher = connection.play(await ytdl(url, { filter: "audioonly" }), {
            volume: false,
            type: "opus",
            highWaterMark: 50,
        });

        // Remove the event listener once we disconnect
        connection.on("disconnect", () => this.client.removeListener("voiceStateUpdate", listenerFunc));

        // Disconnnect from the voice channel after we are finished playing and destroy are event listener
        dispatcher.on("finish", message.guild.me.voice.channel.leave);
    }
}
