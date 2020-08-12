import { Plexi } from "../Plexi";
import { GuildMember } from "discord.js";

export default async function (client: Plexi, [member]: [GuildMember]): Promise<void> {
    const autorole = (await client.database.getGuild(member.guild.id)).autorole;
    if (autorole) {
        member.roles.add(await member.guild.roles.fetch(autorole));
    }
}
