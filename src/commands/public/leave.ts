import { Message } from "discord.js";
import Command from "../../util/Command.js";

export default Command.create({
    description: "Leave the current vc",
    call (message: Message): void {
        if (message.guild.me.voice.channel) {
            message.guild.me.voice.channel.leave();
        }
    }
});