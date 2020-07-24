import { Message, VoiceChannel } from "discord.js";
import ytdl from "ytdl-core";
import Command from "../../util/Command.js";

export default Command.create({
    args: ["voiceChannel", "url"],
    description: "Play a youtube video into a vc, the voice channel must be the id of the vc to connect to",
    call (message: Message, args: string): void {
        if (message.guild.channels.cache.has(args[0]) && message.guild.channels.cache.get(args[0]).type === "voice") {
            if (args[1].toLowerCase().startsWith("https://youtube.com/") || args[1].toLowerCase().startsWith("https://youtu.be/") || args[1].toLowerCase().startsWith("https://www.youtube.com/") || args[1].toLowerCase().startsWith("https://www.youtu.be/")) {
                message.channel.send(`🎵  Playing audio from ${args[1]}  🎵`);
                (message.guild.channels.cache.get(args[0]) as VoiceChannel).join().then(connection => {
                    const dispatcher = connection.play(ytdl(args[1], { filter: "audioonly" }));
                    dispatcher.on("finish", () => message.guild.me.voice.channel.leave());
                });
            } else {
                message.channel.send("This must be a youtube url, search terms aren't supported yet.");
            }
        } else {
            message.channel.send("You must specify a valid voice channel!");
        }
    }
});