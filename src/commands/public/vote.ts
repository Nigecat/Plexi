import { Message } from "discord.js";
import Command from "../../util/Command.js";

export default Command.create({
    description: "Vote for the bot on top.gg, this doesn't really do anything right now but is very appreciated",
    call (message: Message): void {
        message.channel.send("https://top.gg/bot/621179289491996683/vote/");
    }
});