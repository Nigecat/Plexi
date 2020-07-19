import { Permissions, User } from "discord.js";
import { Command, CommandData } from "../../types.js";

export default <Command> {
    description: "Ban a user",
    args: [User],
    perms: ["BAN_MEMBERS"],
    call({ message }: CommandData) {
        message.mentions.members.first().ban().then(() => {
            message.channel.send(`**Successfully banned:** ${message.mentions.members.first().user}`);
        }).catch(err => {
            message.channel.send("It appears something has gone wrong, chances are you attempted to ban someone who has a higher role than this bot.");
        });
    }
}