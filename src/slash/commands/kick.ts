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

        if (user.kickable) {
            await user.kick();
            return ephemeral(`${user} successfully kicked.`);
        } else {
            return ephemeral(`Unable to kick ${user}, I can't kick anyone with a higher role than me.`);
        }
    }
}
