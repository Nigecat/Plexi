import { GuildMember } from "discord.js";
import { hasHigherRole } from "../../util.js";
import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Ban extends Command {
    constructor(client: Client) {
        super(client, {
            name: "ban",
            memberName: "ban",
            group: "admin",
            guildOnly: true,
            clientPermissions: ["BAN_MEMBERS"],
            userPermissions: ["BAN_MEMBERS"],
            description: "Ban a user (NOTE: Does NOT delete any messages)",
            args: [
                {
                    key: "user",
                    prompt: "Who do you want to ban?",
                    type: "member"
                },
                {
                    key: "reason",
                    prompt: "Why are you banning this person?",
                    type: "string",
                    infinite: true,
                    default: ["No reason was provided."]
                }
            ]
        });
    }

    async run(message: CommandoMessage, { user, reason }: { user: GuildMember, reason: string[] }) {
        if (user.bannable && hasHigherRole(message.member, user)) {
            await user.ban({ reason: `${reason.join(" ")} (banned by ${message.author.tag})` });
            return message.say(`${user} successfully banned by ${message.author}\nReason: ${reason.join(" ")}`, { allowedMentions: { roles: [], users: [] } });
        } else {
            return message.say("I could not ban that user, they may have a higher role than I do or have a higher role than you.");
        }
    }
}