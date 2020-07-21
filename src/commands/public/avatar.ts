import { MessageEmbed } from "discord.js";
import { Command, CommandData, InvalidArgument } from "../../types.js";

export default {
    description: "Get a user's avatar",
    args: ["<@user>"],
    call({ message, args }: CommandData) {
        if (args.length !== 1 || message.mentions.users.size !== 1) throw new InvalidArgument();
    
        const embed = new MessageEmbed({
            color: "#0099ff",
            title: message.mentions.users.first().tag,
            image: { url: message.mentions.users.first().avatarURL({ dynamic: true, format: "png", size: 512 }) }
        });
        message.channel.send({ embed });
    }
} as Command