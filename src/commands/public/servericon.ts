import { Message, MessageEmbed } from "discord.js";
import Command from "../../util/Command.js";

export default <Command> {
    description: "Get the server's icon",
    call (message: any): void {
        const embed: MessageEmbed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle(message.channel.guild.name)
            .setImage(`${message.channel.guild.iconURL()}?size=512`);

        message.channel.send({ embed });
    }
}