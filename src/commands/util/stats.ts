import { Command } from "plexi/command";
import { PlexiClient } from "plexi/client";
import { version } from "../../../package.json";
import { Message, MessageEmbed } from "discord.js";

export default class Stats extends Command {
    constructor(client: PlexiClient) {
        super(client, {
            name: "stats",
            description: "Get general stats about the bot"
        });
    }

    run(message: Message) {
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
                { name: "Useful Links", value: `[Invite Me](https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&scope=bot) | [Support Server](${this.client.supportInvite})` }
            ],
            footer: { text: "v" + version }
        });

        message.channel.send({ embed });
    }
}