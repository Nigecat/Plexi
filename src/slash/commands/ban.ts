import { Plexi } from "../../Plexi";
import { ephemeral, user } from "../utils";
import { InteractionData, InteractionDataOptions, SlashCommand, SlashCommandResponse } from "../SlashCommand";

export default class Ban extends SlashCommand {
    constructor(client: Plexi) {
        super(client, {
            name: "ban",
            description: "Ban a user",
            options: [user("The user to ban")],
        });
    }

    async handler(
        interaction: InteractionData,
        [{ value: user }]: InteractionDataOptions,
    ): Promise<SlashCommandResponse> {
        const guild = await this.client.guilds.fetch(interaction.guild_id);
        const member = await guild.members.fetch(user);
        const author = await guild.members.fetch(interaction.member.user.id);

        if (member.bannable) {
            if (author.roles.highest.position > member.roles.highest.position) {
                await member.ban();
                return ephemeral(`${member} successfully banned.`);
            } else {
                return ephemeral(`Unable to ban ${member}, I can't ban someone with a higher role than you.`);
            }
        } else {
            return ephemeral(`Unable to ban ${member}, I can't ban anyone with a higher role than me.`);
        }
    }
}
