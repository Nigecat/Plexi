import { Plexi } from "../Plexi";
import { Message } from "discord.js";

// @someone feature replication, see https://youtu.be/BeG5FqTpl9U
export default function (client: Plexi): void {
    client.on("message", async (message: Message) => {
        // Ignore bot messages
        if (message.author.bot) return;

        if (message.mentions.roles.size > 0 && message.mentions.roles.some((role) => role.name === "someone")) {
            const role = message.guild.roles.cache.find((role) => role.name === "someone");
            if (role) {
                const member = await message.guild.members.cache.random().roles.add(role);
                const ping = await message.channel.send(role, {
                    allowedMentions: { roles: [role.id] },
                    disableMentions: "everyone",
                });
                await ping.delete();
                await member.roles.remove(role);
            }
        }
    });
}
