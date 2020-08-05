import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { stripIndents } from "common-tags";

export default class CreateRolePreset extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "create-role-preset",
            group: "Administrative",
            description: "Create a role preset",
            userPermissions: ["MANAGE_ROLES"],
            clientPermissions: ["MANAGE_ROLES"],
            details: stripIndents`\n
                **Muted** - Creates a role called 'Muted' that has the permission to send messages in all channels denied.
                This role will be able to join voice channels, but unable to speak. 
                This role **must be manually hoisted** as high as possible to be effective. 
                Giving this role to a user will 'mute' them and render them unable to talk.
            `,
            args: [
                {
                    name: "preset",
                    type: "string",
                    oneOf: ["muted", "warning"],
                },
            ],
        });
    }

    async run(message: Message, [preset]: ["muted" | "warning"]): Promise<void> {
        if (preset === "muted") {
            // Check if a role with this name already exists
            if (!message.guild.roles.cache.some((role) => role.name.toLowerCase() === "muted")) {
                // If it doesn't create the muted role
                const role = await message.guild.roles.create({
                    reason: `'create-role-preset muted' run by ${message.author.tag} | ${message.author.id}`,
                    data: {
                        name: "Muted",
                        hoist: true,
                        color: "#99aab5",
                        mentionable: false,
                        permissions: ["READ_MESSAGE_HISTORY", "ADD_REACTIONS"],
                    },
                });

                message.guild.channels.cache.forEach((channel) => {
                    channel.updateOverwrite(
                        role,
                        {
                            SEND_MESSAGES: false,
                            SPEAK: false,
                        },
                        `'create-role-preset muted' run by ${message.author.tag} | ${message.author.id}`,
                    );
                });

                message.channel.send("Successfully created 'Muted' role preset!");
            } else {
                message.channel.send("Error: A 'Muted' role already exists.");
            }
        }
    }
}
