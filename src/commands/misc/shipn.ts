import { GuildMember } from "discord.js";
import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class ShipN extends Command {
    constructor(client: Client) {
        super(client, {
            name: "shipn",
            memberName: "shipn",
            guildOnly: true,
            description: "Ship two users (merge their nicknames)",
            group: "misc",
            args: [
                {
                    key: "user1",
                    prompt: "Who is the first person?",
                    type: "member"
                },
                {
                    key: "user2",
                    prompt: "Who is the second person?",
                    type: "member"
                }
            ]
        });
    }

    run(message: CommandoMessage, { user1, user2 }: { user1: GuildMember, user2: GuildMember }) {
        const firsthalf = user1.displayName.slice(0, Math.ceil(user1.displayName.length / 2));
        const secondhalf = user2.displayName.slice(Math.ceil(user2.displayName.length / 2) * -1);

        // Combine the first half of user1's username with the second half of user2's username
        return message.say(`**${user1.displayName} 💞 ${user2.displayName} = ${firsthalf}${secondhalf}**`, { allowedMentions: { roles: [], users: [] } });
    }
}