import { Message, MessageEmbed } from "discord.js";
import Command from "../../util/Command.js";

export default Command.create({
    args: ["@user"],
    description: "Get a user's avatar",
    call (message: Message): void {
        const embed: MessageEmbed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle(message.mentions.users.first().tag)
            .setImage(`${message.mentions.users.first().displayAvatarURL()}?size=512`);

        message.channel.send({ embed });
    }
});