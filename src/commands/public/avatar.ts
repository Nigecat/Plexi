import { Message, MessageEmbed } from "discord.js";

export default {
    args: ["@user"],
    description: "Get a user's avatar",
    call: function(message: Message): void {
        let embed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle(message.mentions.users.first().tag)
            .setImage(`${message.mentions.users.first().displayAvatarURL()}?size=512`);

        message.channel.send({embed});
    }
}