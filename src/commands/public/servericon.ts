import { Message, MessageEmbed } from "discord.js";

export default {
    description: "Get the server's icon",
    call (message: any) {
        const embed: MessageEmbed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle(message.channel.guild.name)
            .setImage(`${message.channel.guild.iconURL()}?size=512`);

        message.channel.send({ embed });
    }
}