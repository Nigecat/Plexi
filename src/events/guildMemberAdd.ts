import { Plexi } from "../Plexi";
import { GuildMember } from "discord.js";

export default async function (member: GuildMember, client: Plexi): Promise<void> {
    const autorole = await client.autoroles.get(member.guild.id);
    if (autorole) {
        member.roles.add(autorole);
    }
}
