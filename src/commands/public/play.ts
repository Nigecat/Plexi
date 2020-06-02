import { Message } from "discord.js";
import ytdl from "ytdl-core";
import Command from "../../util/Command.js";

export default Command.create({
    args: ["url"],
    description: "Play a youtube video into a vc",
    call (message: Message, args: string): void {
        if (message.member.voice.channel) {
            if (args[0].toLowerCase().startsWith("https://youtube.com/") || args[0].toLowerCase().startsWith("https://youtu.be/") || args[0].toLowerCase().startsWith("https://www.youtube.com/") || args[0].toLowerCase().startsWith("https://www.youtu.be/")) {
                message.channel.send(`🎵  Playing audio from ${args[0]}  🎵`);
                message.member.voice.channel.join().then(connection => {
                    const dispatcher = connection.play(ytdl(args[0], { filter: "audioonly" }));
                    dispatcher.on("finish", () => message.guild.me.voice.channel.leave());
                });
            } else {
                message.channel.send("This must be a youtube url, search terms aren't supported yet.");
            }
        } else {
            message.channel.send("You must be in a vc to run this!");
        }
    }
});