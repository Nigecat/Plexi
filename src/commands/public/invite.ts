import { Command, CommandData, InvalidArgument } from "../../types.js";

export default {
    description: "Get a bot invite link",
    call({ message }: CommandData) {
        message.channel.send("https://discordapp.com/oauth2/authorize?client_id=621179289491996683&permissions=8&scope=bot");
    }
} as Command
