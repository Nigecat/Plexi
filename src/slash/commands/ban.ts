import { Plexi } from "../../Plexi";
import { ephemeral, user } from "../utils";
import { InteractionData, SlashCommand, SlashCommandResponse } from "../SlashCommand";

export default class Ban extends SlashCommand {
    constructor(client: Plexi) {
        super(client, {
            name: "ban",
            description: "Ban a user",
            options: [user("The user to ban")],
        });
    }

    async handler(interaction: InteractionData): Promise<SlashCommandResponse> {
        const guild = await this.client.guilds.fetch(interaction.guild_id);
        const user = await guild.members.fetch(interaction.data.options[0].value);
        const author = await guild.members.fetch(interaction.member.user.id);

        if (user.bannable) {
            if (author.roles.highest.position > user.roles.highest.position) {
                await user.ban();
                return ephemeral(`${user} successfully banned.`);
            } else {
                return ephemeral(`Unable to ban ${user}, I can't ban someone with a higher role than you.`);
            }
        } else {
            return ephemeral(`Unable to ban ${user}, I can't ban anyone with a higher role than me.`);
        }
    }
}
