import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { Message, User } from "discord.js";

export default class Ship extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "ship",
            group: "Miscellaneous",
            description: "Ship two users (merge their usernames)",
            args: [
                {
                    name: "user1",
                    type: "user",
                },
                {
                    name: "user2",
                    type: "user",
                },
            ],
        });
    }

    run(message: Message, [user1, user2]: [User, User]): void {
        const firsthalf = user1.username.slice(0, Math.ceil(user1.username.length / 2));
        const secondhalf = user2.username.slice(Math.ceil(user2.username.length / 2) * -1);

        // Combine the first half of user1's username with the second half of user2's username
        message.channel.send(`**${user1.username} 💞 ${user2.username} = ${firsthalf}${secondhalf}**`);
    }
}
