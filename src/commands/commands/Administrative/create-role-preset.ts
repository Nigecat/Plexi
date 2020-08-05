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
                TODO
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
        console.log(preset);
    }
}
