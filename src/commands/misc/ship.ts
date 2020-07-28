import { User } from "discord.js";
import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Ship extends Command {
    constructor(client: Client) {
        super(client, {
            name: "ship",
            memberName: "ship",
            guildOnly: true,
            description: "Ship two users (merge their usernames)",
            group: "misc",
            args: [
                {
                    key: "user1",
                    prompt: "Who is the first person?",
                    type: "user"
                },
                {
                    key: "user2",
                    prompt: "Who is the second person?",
                    type: "user"
                }
            ]
        });
    }

    run(message: CommandoMessage, { user1, user2 }: { user1: User, user2: User }) {
        const firsthalf = user1.username.slice(0, Math.ceil(user1.username.length / 2));
        const secondhalf = user2.username.slice(Math.ceil(user2.username.length / 2) * -1);

        // Combine the first half of user1's username with the second half of user2's username
        return message.say(`**${user1.username} 💞 ${user2.username} = ${firsthalf}${secondhalf}**`, { allowedMentions: { roles: [], users: [] } });
    }
}