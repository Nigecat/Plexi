import { Message, GuildMember } from "discord.js";
import Command from "../../util/Command.js";

export default Command.create({
    args: ["@user"],
    perms: ["BAN_MEMBERS"],
    description: "Ban a user",
    call (message: Message): void {
        const member: GuildMember = message.mentions.members.first();
        try {
            member.ban().then(() => {
                message.channel.send(`**Successfully banned:** ${member.user.tag}`);
            }).catch(err => {
                message.channel.send("It appears something has gone wrong, chances are you attempted to ban someone who has a higher role than this bot.");
            });
        } catch (err) {
            message.channel.send("It appears something has gone wrong, chances are you didn't @ a valid user");
        }
    }
});