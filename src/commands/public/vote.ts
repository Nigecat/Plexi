import { Message } from "discord.js";

export default {
    description: "Vote for the bot on top.gg, this doesn't really do anything right now but is very appreciated",
    call (message: Message) {
        message.channel.send("https://top.gg/bot/621179289491996683/vote/");
    }
}