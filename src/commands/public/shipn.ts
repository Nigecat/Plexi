import { Message } from "discord.js";
import Command from "../../util/Command.js";

export default Command.create({
    args: ["@user1", "@user2"],
    description: "Ship two users (merge their nicknames)",
    call (message: Message): void {
        const user1: string = message.guild.member(message.mentions.members.first().user).displayName;
        const user2: string = message.guild.member(message.mentions.members.last().user).displayName;
        const firsthalf: string = user1.slice(0, Math.ceil(user1.length / 2));
        const secondhalf: string = user2.slice(Math.ceil(user2.length / 2) * -1);

        // Combine the first half of user1's nickname with the second half of user2's nickname
        message.channel.send(`**${user1} 💞 ${user2} = ${firsthalf}${secondhalf}**`);
    }
});