import { Plexi } from "../../Plexi";
import { GuildMember, Role } from "discord.js";
import { user, role, ephemeral } from "../utils";
import { InteractionData, SlashCommand, SlashCommandResponse } from "../SlashCommand";

export default class Roles extends SlashCommand {
    constructor(client: Plexi) {
        super(client, {
            name: "roles",
            description: "Modify a user's roles",
            options: [
                {
                    name: "add",
                    description: "Add a role to a user",
                    type: 1,
                    options: [user("The user to add the role to"), role("The role to add")],
                },
                {
                    name: "remove",
                    description: "Remove a role from a user",
                    type: 1,
                    options: [user("The user to remove the role from"), role("The role to remove")],
                },
            ],
        });
    }

    async handler(interaction: InteractionData): Promise<SlashCommandResponse> {
        const subcommand = interaction.data.options[0].name;
        const args = interaction.data.options[0].options;

        const guild = await this.client.guilds.fetch(interaction.guild_id);
        const user = await guild.members.fetch(args.find((arg) => arg.name === "user").value);
        const role = await guild.roles.fetch(args.find((arg) => arg.name === "role").value);

        const helper = async (
            success: string,
            failure: string,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            operation: (user: GuildMember, role: Role) => Promise<any>,
        ): Promise<SlashCommandResponse> => {
            try {
                await operation(user, role);
                return ephemeral(success);
            } catch {
                return ephemeral(failure);
            }
        };

        switch (subcommand) {
            case "add": {
                return helper(
                    `${role} successfully added to ${user}.`,
                    `Unable to add ${role} to ${user}, I can only add roles below my highest role.`,
                    (user, role) => user.roles.add(role),
                );
                break;
            }

            case "remove": {
                return helper(
                    `${role} successfully removed from ${user}.`,
                    `Unable to remove ${role} from ${user}, I can only remove roles below my highest role.`,
                    (user, role) => user.roles.remove(role),
                );
                break;
            }
        }
    }
}
