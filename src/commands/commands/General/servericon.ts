import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { Message, MessageEmbed } from "discord.js";

export default class ServerIcon extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "servericon",
            group: "General",
            description: "Get the icon of this server",
            guildOnly: true,
        });
    }

    run(message: Message): void {
        const embed = new MessageEmbed({
            color: "#0099ff",
            title: message.guild.name,
            image: { url: message.guild.iconURL({ dynamic: true, format: "png", size: 512 }) },
        });

        message.channel.send({ embed });
    }
}
