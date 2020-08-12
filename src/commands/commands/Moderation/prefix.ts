import { Command } from "../../Command";
import { Plexi } from "../../../Plexi";
import { oneLine } from "common-tags";
import { Message } from "discord.js";

export default class Prefix extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "prefix",
            group: "Moderation",
            guildOnly: true,
            userPermissions: ["ADMINISTRATOR"],
            description: oneLine`
                Set the prefix for this server, 
                if no prefix is specified this will return the current prefix for this server
            `,
            args: [
                {
                    name: "prefix",
                    type: "string",
                    default: "DISPLAY_DEFAULT",
                },
            ],
        });
    }

    async run(message: Message, [prefix]: [string]): Promise<void> {
        if (prefix === "DISPLAY_DEFAULT") {
            prefix = this.client.database
                ? (await this.client.database.getGuild(message.guild.id)).prefix
                : this.client.config.prefix;
            message.channel.send(`The current prefix for this server is: \`${prefix}\``);
        } else {
            await this.client.database.updateGuild(message.guild.id, "prefix", prefix);
            message.channel.send(`This server's prefix is now: \`${prefix}\``);
        }
    }
}
