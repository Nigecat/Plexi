import { Plexi } from "../../Plexi";
import { ephemeral, message, user } from "../utils";
import { InteractionData, InteractionDataOptions, SlashCommand, SlashCommandResponse } from "../SlashCommand";

export default class Deafen extends SlashCommand {
    constructor(client: Plexi) {
        super(client, {
            name: "deafen",
            description: "Server deafen a user",
            options: [user("The user to deafen")],
        });
    }

    async handler(
        interaction: InteractionData,
        [{ value: user }]: InteractionDataOptions,
    ): Promise<SlashCommandResponse> {
        const guild = await this.client.guilds.fetch(interaction.guild_id);
        const member = await guild.members.fetch(user);
        const author = await guild.members.fetch(interaction.member.user.id);

        if (!author.hasPermission("DEAFEN_MEMBERS")) {
            return message("You don't have permission to deafen members in this server.");
        }

        try {
            await member.voice.setDeaf(true);
            return ephemeral(`${member} successfully deafened.`);
        } catch {
            return message("I could not deafen that user, I may not have permissions to do that.");
        }
    }
}
