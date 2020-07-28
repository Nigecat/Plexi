import { YouTube } from "popyt";
import * as ytdl from "ytdl-core";
import { Command, Client, CommandoMessage } from "discord.js-commando";
import { VoiceConnection } from "discord.js";

export default class Loop extends Command {
    constructor(client: Client) {
        super(client, {
            name: "loop",
            memberName: "loop",
            group: "music",
            description: "Loop the supplied song into your voice channel",
            args: [
                {
                    key: "search",
                    prompt: "What is your seach query?",
                    type: "string",
                }
            ]
        });
    }

    async run(message: CommandoMessage, { search }: { search: string }) {
        // Make sure the user is in a voice channel
        if (!message.member.voice.channel) {
            return message.say("You must be in a voice channel to run this command!");
        }

        message.channel.startTyping();
        let video: any;

        const youtube = new YouTube(process.env.YOUTUBE_API_TOKEN);
        try {
            video = await youtube.getVideo(search);
        } catch {
            return message.say("Video not found!");
        } finally {
            message.channel.stopTyping();
        }

        const url = `https://www.youtube.com/watch?v=${video.data.id}`;

        const connection = await message.member.voice.channel.join();
        this.play(connection, url);


        return message.say(`🎵  Found video: \`${video.data.snippet.title}\`  🎵\n(Url: ${url})`);
    }

    /** Loop a song */
    play(connection: VoiceConnection, url: string) {
        const dispatcher = connection.play(ytdl(url, { filter: "audioonly" }));
        dispatcher.on("finish", () => this.play(connection, url));
    }
}