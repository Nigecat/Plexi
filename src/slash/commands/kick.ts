import { Plexi } from "../../Plexi";
import { ephemeral, user } from "../utils";
import { InteractionData, SlashCommand, SlashCommandResponse } from "../SlashCommand";

export default class Kick extends SlashCommand {
    constructor(client: Plexi) {
        super(client, {
            name: "kick",
            description: "Kick a user",
            options: [user("The user to kick")],
        });
    }

    async handler(interaction: InteractionData): Promise<SlashCommandResponse> {
        const guild = await this.client.guilds.fetch(interaction.guild_id);
        const user = await guild.members.fetch(interaction.data.options[0].value);
        const author = await guild.members.fetch(interaction.member.user.id);

        if (user.kickable) {
            if (author.roles.highest.position > user.roles.highest.position) {
                await user.kick();
                return ephemeral(`${user} successfully kicked.`);
            } else {
                return ephemeral(`Unable to kick ${user}, I can't kick someone with a higher role than you.`);
            }
        } else {
            return ephemeral(`Unable to kick ${user}, I can't kick anyone with a higher role than me.`);
        }
    }
}
