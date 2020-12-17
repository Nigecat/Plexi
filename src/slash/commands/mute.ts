import { Plexi } from "../../Plexi";
import { ephemeral, message, user } from "../utils";
import { InteractionData, InteractionDataOptions, SlashCommand, SlashCommandResponse } from "../SlashCommand";

export default class Mute extends SlashCommand {
    constructor(client: Plexi) {
        super(client, {
            name: "mute",
            description: "Server mute a user",
            options: [user("The user to mute")],
        });
    }

    async handler(
        interaction: InteractionData,
        [{ value: user }]: InteractionDataOptions,
    ): Promise<SlashCommandResponse> {
        const guild = await this.client.guilds.fetch(interaction.guild_id);
        const member = await guild.members.fetch(user);
        const author = await guild.members.fetch(interaction.member.user.id);

        if (!author.hasPermission("MUTE_MEMBERS")) {
            return message("You don't have permission to mute members in this server.");
        }

        try {
            await member.voice.setMute(true);
            return ephemeral(`${member} successfully muted.`);
        } catch {
            return message("I could not mute that user, I may not have permissions to do that.");
        }
    }
}
