import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";

export default class Chain extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "chain",
            group: "Debug",
            description: "Chain multiple single word commands, no arguments are allowed",
            hidden: true,
            ownerOwnly: true,
            args: [
                {
                    name: "commands",
                    type: "string",
                    infinite: true,
                },
            ],
        });
    }

    async run(message: Message, [commands]: [string]): Promise<void> {
        for (const command of commands.split(" ")) {
            await this.client.commands.get(command).run(message);
        }
    }
}
