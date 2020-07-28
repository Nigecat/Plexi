import { YouTube } from "popyt";
import * as ytdl from "ytdl-core";
import { CommandoMessage, Command, Client } from "discord.js-commando";

export default class Play extends Command {
    constructor(client: Client) {
        super(client, {
            name: "play",
            memberName: "play",
            aliases: ["p"],
            clientPermissions: ["CONNECT"],
            group: "music",
            guildOnly: true,
            description: "Play music into your voice channel (takes either a search query or a youtube url)",
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
        message.channel.startTyping();

        const youtube = new YouTube(process.env.YOUTUBE_API_TOKEN);
        const video = await youtube.getVideo(search);
        const url = `https://www.youtube.com/watch?v=${video.data.id}`;

        message.channel.stopTyping();

        // Make sure the user is in a voice channel
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            const dispather = connection.play(ytdl(url, { filter: "audioonly" }));

            // Disconnnect from the voice channel after we are finished playing
            dispather.on("finish", () => message.guild.me.voice.channel.leave());
            return message.say(`🎵  Found video: \`${video.data.snippet.title}\`  🎵\n(Url: ${url})`);
        } else {
            return message.say("You must be in a voice channel to run this command!");
        }
    }
}