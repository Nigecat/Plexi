import { MessageEmbed } from "discord.js";
import { Command, CommandData } from "../../types.js";

export default {
    description: "Get the current server's icon",
    call({ message }: CommandData) {
        const embed = new MessageEmbed({
            color: "#0099ff",
            title: message.guild.name,
            image: { url: message.guild.iconURL({ dynamic: true, format: "png", size: 512 }) }
        });
        message.channel.send({ embed });
    }
} as Command