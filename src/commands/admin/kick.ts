import { GuildMember } from "discord.js";
import { hasHigherRole } from "../../util.js";
import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Kick extends Command {
    constructor(client: Client) {
        super(client, {
            name: "kick",
            memberName: "kick",
            group: "admin",
            clientPermissions: ["KICK_MEMBERS"],
            userPermissions: ["KICK_MEMBERS"],
            description: "Kick a user",
            args: [
                {
                    key: "user",
                    prompt: "Who do you want to kick?",
                    type: "member"
                },
                {
                    key: "reason",
                    prompt: "Why are you kicking this person?",
                    type: "string",
                    infinite: true,
                    default: ["No reason was provided."]
                }
            ]
        });
    }

    async run(message: CommandoMessage, { user, reason }: { user: GuildMember, reason: string[] }) {
        if (user.kickable && hasHigherRole(message.member, user)) {
            await user.kick(`${reason.join(" ")} (kicked by ${message.author.tag})`);
            return message.say(`${user} successfully kicked by ${message.author}\nReason: ${reason.join(" ")}`, { allowedMentions: { roles: [], users: [] } });
        } else {
            return message.say("I could not kick that user, they may have a higher role than I do or have a higher role than you.");
        }
    }
}