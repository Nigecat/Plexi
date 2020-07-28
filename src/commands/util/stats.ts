import { MessageEmbed } from "discord.js";
import { botInvite } from "../../config/config.json";
import { invite } from "../../config/clientConfig.json";
import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Stats extends Command {
    constructor(client: Client) {
        super(client, {
            name: "stats",
            memberName: "stats",
            group: "util",
            description: "Get general stats about the bot"
        });
    }

    run(message: CommandoMessage) {
        const embed = new MessageEmbed({
            color: "#0099ff",
            title: this.client.user.username + " Stats",
            thumbnail: { url: this.client.user.avatarURL({ dynamic: true, format: "png", size: 512 }) },
            fields: [ 
                { name: "Total (Cached) Servers", value: this.client.guilds.cache.size, inline: true },
                { name: "Total (Cached) Users", value: this.client.users.cache.size, inline: true },
                { name: "Total (Cached) Channels", value: this.client.channels.cache.size, inline: true },
                { name: "Memory Usage (MB)", value: process.memoryUsage().heapUsed / 1024 / 1024 },
                { name: "Uptime (hours)", value: process.uptime() / 3600, inline: true },
                { name: "Useful Links", value: `[Invite Me](${botInvite}) | [Support Server](${invite})` }
            ]
        });
        return message.embed(embed);
    }
}