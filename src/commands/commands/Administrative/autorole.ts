import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { stripIndents } from "common-tags";
import { Message, Role } from "discord.js";
import { isHigherRole } from "../../../utils/misc";

export default class Autorole extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "autorole",
            group: "Administrative",
            userPermissions: ["ADMINISTRATOR"],
            description: "Set or view an autorole for this server",
            details: stripIndents`
                Set an autorole for this server, this role will be automatically applied to any new members. 
                If no role is specified it will view the current autorole for this server.
                To clear the autorole run \`autorole <currentRole>\` (like you were setting it again) to clear it.
            `,
            args: [
                {
                    name: "role",
                    type: "role",
                    default: "DISPLAY_CURRENT",
                },
            ],
        });
    }

    async run(message: Message, [role]: [Role]): Promise<void> {
        const current = await this.client.autoroles.get(message.guild.id);

        // If we just want to check what the current autorole is
        if (((role as unknown) as string) === "DISPLAY_CURRENT") {
            if (current) {
                message.channel.send(`This server's autorole is currently: ${current}`);
            } else {
                message.channel.send("This server does not currently have an autorole!");
            }
        } else if (current && role.id === current.id) {
            // If it is the same one then remove it
            this.client.autoroles.del(message.guild.id);
            message.channel.send("Autorole cleared!");
        } else {
            // If we have a higher role than the autorole
            if (isHigherRole(message.guild.me.roles.highest, role)) {
                await this.client.autoroles.set(message.guild.id, role.id);
                message.channel.send(`Autorole set to: ${role}`);
            } else {
                message.channel.send("You can't assign a role higher than my highest role!");
            }
        }
    }
}
