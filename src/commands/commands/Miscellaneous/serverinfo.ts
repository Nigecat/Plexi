import { Command } from "../../Command";
import { Plexi } from "../../../Plexi";
import { Message, MessageEmbed } from "discord.js";

export default class ServerInfo extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "serverinfo",
            group: "Miscellaneous",
            description: "Get info on this server",
            guildOnly: true,
        });
    }

    run(message: Message): void {
        const embed = new MessageEmbed({
            color: "#7289da",
            title: message.guild.name,
            thumbnail: { url: message.guild.iconURL({ dynamic: true, format: "png", size: 512 }) },
            fields: [
                { name: "Server ID", value: message.guild.id },
                { name: "Region", value: message.guild.region },
                { name: "Total Members", value: message.guild.memberCount },
                { name: "Owner", value: message.guild.owner },
                { name: "You joined", value: new Date(message.member.joinedTimestamp).toUTCString() },
                { name: "Server created", value: new Date(message.guild.createdAt).toUTCString() },
            ],
        });

        message.channel.send({ embed });
    }
}
