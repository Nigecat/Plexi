import { Message } from "discord.js";
import Command from "../../util/Command.js";

export default Command.create({
    description: "Get a bot invite link",
    call (message: Message): void {
        message.channel.send("https://discordapp.com/oauth2/authorize?client_id=621179289491996683&permissions=8&scope=bot");
    }
});