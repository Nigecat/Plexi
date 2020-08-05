import ytdl from "ytdl-core";
import { YouTube } from "popyt";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { Message, VoiceConnection } from "discord.js";

export default class Loop extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "loop",
            clientPermissions: ["CONNECT"],
            userPermissions: ["SPEAK"],
            group: "Music",
            guildOnly: true,
            description: "Loop music into your voice channel (takes either a search query or a youtube url)",
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let video: any;
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
        this.play(connection, url);
    }

    /** Loop a song */
    play(connection: VoiceConnection, url: string): void {
        const dispatcher = connection.play(ytdl(url, { filter: "audioonly" }));
        dispatcher.on("finish", () => this.play(connection, url));
    }
}