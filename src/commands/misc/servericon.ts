import { Command } from "plexi/command";
import { PlexiClient } from "plexi/client";
import { Message, MessageEmbed } from "discord.js";

export default class ServerIcon extends Command {
    constructor(client: PlexiClient) {
        super(client, {
            name: "servericon",
            description: "Get this server's icon",
            guildOnly: true
        });
    }

    run(message: Message) {
        const embed = new MessageEmbed({
            color: "#0099ff",
            title: message.guild.name,
            image: { url: message.guild.iconURL({ dynamic: true, format: "png", size: 512 }) }
        });
        message.channel.send({ embed });
    }
}