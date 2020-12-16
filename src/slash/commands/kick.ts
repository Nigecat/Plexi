import { Plexi } from "../../Plexi";
import { ephemeral, user } from "../utils";
import { InteractionData, InteractionDataOptions, SlashCommand, SlashCommandResponse } from "../SlashCommand";

export default class Kick extends SlashCommand {
    constructor(client: Plexi) {
        super(client, {
            name: "kick",
            description: "Kick a user",
            options: [user("The user to kick")],
        });
    }

    async handler(
        interaction: InteractionData,
        [{ value: user }]: InteractionDataOptions,
    ): Promise<SlashCommandResponse> {
        const guild = await this.client.guilds.fetch(interaction.guild_id);
        const member = await guild.members.fetch(user);
        const author = await guild.members.fetch(interaction.member.user.id);

        if (member.kickable) {
            if (author.roles.highest.position > member.roles.highest.position) {
                await member.kick();
                return ephemeral(`${member} successfully kicked.`);
            } else {
                return ephemeral(`Unable to kick ${member}, I can't kick someone with a higher role than you.`);
            }
        } else {
            return ephemeral(`Unable to kick ${member}, I can't kick anyone with a higher role than me.`);
        }
    }
}
