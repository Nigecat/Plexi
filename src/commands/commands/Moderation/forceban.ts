import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { Message, Snowflake, GuildMember } from "discord.js";

export default class ForceBan extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "forceban",
            group: "Moderation",
            guildOnly: true,
            description: "Ban a user by their id, this does not require the user to be in this server.",
            clientPermissions: ["BAN_MEMBERS"],
            userPermissions: ["ADMINISTRATOR"],
            args: [
                {
                    name: "user",
                    type: "string",
                },
                {
                    name: "reason",
                    type: "string",
                    default: "No reason specified",
                    infinite: true,
                },
            ],
        });
    }

    async run(message: Message, [id, reason]: [Snowflake, string]): Promise<void> {
        const user = await this.client.users.fetch(id);
        const member = new GuildMember(this.client, { id, user }, message.guild);

        member.ban({
            reason: `${reason} (Banned by ${message.author.tag} | ${message.author.id})`,
            days: 0,
        });

        message.channel.send(`Successfully banned ${member.user.tag}`);
    }
}
