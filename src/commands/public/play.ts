import { Message } from "discord.js";
import ytdl from "ytdl-core";
import Command from "../../util/Command.js";

function play(message: Message, url: string) {
    message.member.voice.channel.join().then(connection => {
        const dispatcher = connection.play(ytdl(url, { filter: "audioonly" }));
        dispatcher.on("finish", () => message.guild.me.voice.channel.leave());
    });
}

export default Command.create({
    args: "url",
    description: "Play a youtube video into a vc",
    call (message: Message, args: string): void {
        if (message.member.voice.channel) {
            if (args.toLowerCase().startsWith("https://youtube.com/") || args.toLowerCase().startsWith("https://youtu.be/")) {
                play(message, args);
            } else {
                message.channel.send("This must be a url, search terms aren't supporterd yet.");
            }
        } else {
            message.channel.send("You must be in a vc to run this!");
        }
    }
});