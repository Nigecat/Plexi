import { MessageEmbed } from "discord.js";
import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class ServerInfo extends Command {
    constructor(client: Client) {
        super(client, {
            name: "serverinfo",
            memberName: "serverinfo",
            description: "Get information on this server",
            group: "misc",
            guildOnly: true
        });
    }

    run(message: CommandoMessage) {
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
                { name: "Server created", value: new Date(message.guild.createdAt).toUTCString() }
            ]
        });
        return message.embed(embed, "", { allowedMentions: { roles: [], users: [] } });
    }
}