import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { Message, GuildMember } from "discord.js";

export default class Kick extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "kick",
            group: "Moderation",
            description: "Kick a user",
            clientPermissions: ["KICK_MEMBERS"],
            userPermissions: ["KICK_MEMBERS"],
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
            message.channel.send("You must tell me who to kick!");
            return;
        }

        if (user.kickable) {
            // If the user has a higher role than the person they are trying to ban
            if (message.member.roles.highest.position > user.roles.highest.position) {
                user.kick(`${reason} (Kicked by ${message.author.tag} | ${message.author.id})`);
                message.channel.send(`Successfully kicked ${user.user.tag}`);
            } else {
                message.channel.send("You can't kick someone with a higher role than you!");
            }
        } else {
            message.channel.send("I can't kick that user! They probably have a higher role than me.");
        }
    }
}
