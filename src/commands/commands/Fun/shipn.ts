import { Command } from "../../Command";
import { Plexi } from "../../../Plexi";
import { Message, GuildMember } from "discord.js";

export default class Shipn extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "shipn",
            group: "Fun",
            description: "Ship two users (merge their nicknames)",
            guildOnly: true,
            args: [
                {
                    name: "user1",
                    type: "member",
                },
                {
                    name: "user2",
                    type: "member",
                },
            ],
        });
    }

    run(message: Message, [user1, user2]: [GuildMember, GuildMember]): void {
        const firsthalf = user1.displayName.slice(0, Math.ceil(user1.displayName.length / 2));
        const secondhalf = user2.displayName.slice(Math.ceil(user2.displayName.length / 2) * -1);

        // Combine the first half of user1's username with the second half of user2's username
        message.channel.send(`**${user1.displayName} 💞 ${user2.displayName} = ${firsthalf}${secondhalf}**`);
    }
}
