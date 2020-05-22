import { Message } from "discord.js";

export default {
    args: ["@user1", "@user2"],
    description: "Ship two users (merge their usernames)",
    call (message: Message) {
        const user1: string = message.mentions.members.first().user.username;
        const user2: string = message.mentions.members.last().user.username;
        const firsthalf: string = user1.slice(0, Math.ceil(user1.length / 2));
        const secondhalf: string = user2.slice(Math.ceil(user2.length / 2) * -1);

        // Combine the first half of user1's username with the second half of user2's username
        message.channel.send(`**${user1} 💞 ${user2} = ${firsthalf}${secondhalf}**`);
    }
}