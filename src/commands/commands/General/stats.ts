import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { MessageEmbed, Message } from "discord.js";

export default class Stats extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "stats",
            group: "General",
            description: "Get general stats about the bot",
        });
    }

    run(message: Message): void {
        const embed = new MessageEmbed({
            color: "#0099ff",
            title: this.client.user.username + " Stats",
            thumbnail: { url: this.client.user.avatarURL({ dynamic: true, format: "png", size: 512 }) },
            fields: [
                { name: "Total Servers", value: this.client.guilds.cache.size, inline: true },
                {
                    name: "Total Users",
                    value: this.client.guilds.cache
                        .map(({ memberCount }) => memberCount)
                        .filter((members) => members !== undefined)
                        .reduce((a, b) => a + b, 0),
                    inline: true,
                },
                { name: "Total Channels", value: this.client.channels.cache.size, inline: true },
                { name: "Uptime (hours)", value: process.uptime() / 3600, inline: true },
                {
                    name: "Useful Links",
                    value: `[Invite Me](${this.client.config.invite})`,
                },
            ],
            footer: { text: this.client.config.version ? "v" + this.client.config.version : "" },
        });

        message.channel.send({ embed });
    }
}
