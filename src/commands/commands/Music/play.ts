import ytdl from "ytdl-core-discord";
import { Message } from "discord.js";
import { YouTube, Video } from "popyt";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";

export default class Play extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "play",
            aliases: ["p"],
            clientPermissions: ["CONNECT"],
            userPermissions: ["SPEAK"],
            group: "Music",
            guildOnly: true,
            description: "Play music into your voice channel (takes either a search query or a youtube url)",
            args: [
                {
                    name: "search",
                    type: "string",
                    infinite: true,
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
        const result = await message.channel.send("Searching for video...");
        const youtube = new YouTube(process.env.YOUTUBE_TOKEN);
        try {
            video = await youtube.getVideo(search);
        } catch {
            result.edit("I could not find any videos matching that name.");
            return;
        }

        const url = `https://www.youtube.com/watch?v=${video.data.id}`;
        result.edit(`🎵  Found video: \`${video.data.snippet.title}\`  🎵\n(Url: ${url})`);

        const connection = await message.member.voice.channel.join();

        const dispatcher = connection.play(await ytdl(url, { filter: "audioonly" }), {
            volume: false,
            type: "opus",
            highWaterMark: 50,
        });

        // Disconnnect from the voice channel after we are finished playing
        dispatcher.on("finish", () => message.guild.me.voice.channel.leave());
    }
}
