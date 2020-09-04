import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { Message, TextChannel, NewsChannel } from "discord.js";

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
        let messages = await message.channel.messages.fetch({ limit });
        // Prevent the command itself from being deleted
        messages = messages.filter((msg) => msg.id !== message.id);
        await ((message.channel as unknown) as TextChannel | NewsChannel).bulkDelete(messages);
        message.channel.send(`Successfully deleted ${limit} messages!`);
    }
}
