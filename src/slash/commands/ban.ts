import { Plexi } from "../../Plexi";
import { ephemeral, user, message } from "../utils";
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

        if (!author.hasPermission("BAN_MEMBERS")) {
            return message("You don't have permission to ban users on this server!");
        }

        if (!member.bannable) {
            return message(`Unable to ban ${member}, I can't ban anyone with a higher role than me.`);
        }

        if (author.roles.highest.position <= member.roles.highest.position) {
            return message(`Unable to ban ${member}, I can't ban someone with a higher role than you.`);
        }

        await member.ban();
        return ephemeral(`${member} successfully banned.`);
    }
}
