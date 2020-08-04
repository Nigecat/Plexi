import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { Message, GuildMember } from "discord.js";
import { isHigherRole } from "../../../utils/misc";

export default class Ban extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "ban",
            group: "Administrative",
            description: "Ban a user",
            clientPermissions: ["BAN_MEMBERS"],
            userPermissions: ["BAN_MEMBERS"],
            guildOnly: true,
            args: [
                {
                    name: "user",
                    type: "member",
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

    run(message: Message, [user, reason]: [GuildMember, string]): void {
        if (!user) {
            message.channel.send("You must tell me who to ban!");
            return;
        }

        if (user.bannable) {
            // If the user has a higher role than the person they are trying to ban
            if (isHigherRole(message.member.roles.highest, user.roles.highest)) {
                user.ban({
                    reason: `${reason} (Banned by ${message.author.tag} | ${message.author.id})`,
                    days: 0,
                });

                message.channel.send(`Successfully banned ${user.user.tag}`);
            } else {
                message.channel.send("You can't ban someone with a higher role than you!");
            }
        } else {
            message.channel.send("I can't ban that user! They probably have a higher role than me.");
        }
    }
}
