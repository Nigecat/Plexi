import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";

export default class Purge extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "purge",
            group: "Moderation",
            userPermissions: ["ADMINISTRATOR"],
            clientPermissions: ["MANAGE_MESSAGES"],
            description: "Delete the most recent <limit> messages in this channel. Max 50 messages at a time.",
            args: [
                {
                    name: "limit",
                    type: "number",
                    validate: (limit: number) => limit <= 50,
                },
            ],
        });
    }

    async run(message: Message, [limit]: [number]): Promise<void> {
        await message.channel.bulkDelete(limit);
    }
}
