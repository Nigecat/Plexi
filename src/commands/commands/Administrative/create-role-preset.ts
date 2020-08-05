import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { stripIndents } from "common-tags";
import { Message } from "discord.js";

export default class CreateRolePreset extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "create-role-preset",
            group: "Administrative",
            description: "Create a role preset",
            userPermissions: ["MANAGE_ROLES"],
            clientPermissions: ["MANAGE_ROLES"],
            details: stripIndents`
                **Muted** - Creates a role called 'Muted' that has the permission to send messages in all channels denied.
                This role will also be unable to join voice channels. After creation the role will be hoisted as high as possible.
                However it may need to be manually hoisted above my top role to be more effective. Giving this role to a user will
                'mute' them and render them unable to talk.
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
            if (!message.guild.roles.cache.has("Muted")) {
                const role = await message.guild.roles.create({  });
            } else {
                message.channel.send("A 'Muted' role already exists!");
            }
        }
    }
}
