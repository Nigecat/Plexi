import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { stripIndents } from "common-tags";

export default class CreateRolePreset extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "create-role-preset",
            group: "Administrative",
            description: "Create a role preset",
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
}
