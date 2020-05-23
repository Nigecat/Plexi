import { Message, MessageEmbed, TextChannel } from "discord.js";
import Command from "../../util/Command.js";

export default <Command> {
    description: "Get information on this server",
    call (message: any): void {
        const embed: MessageEmbed = new MessageEmbed()
            .setColor("#7289DA")
            .setTitle(message.channel.guild.name)
            .setThumbnail (`${message.channel.guild.iconURL()}?size=512`)
            .addField("Server ID", message.guild.id)
            .addField("Region", message.guild.region)
            .addField("Total Members", message.guild.memberCount)
            .addField("You joined", new Date(message.guild.joinedTimestamp).toUTCString())
            .setFooter(`Server created ${new Date(message.guild.createdAt).toUTCString()}`)

        message.channel.send({ embed });
    }
}