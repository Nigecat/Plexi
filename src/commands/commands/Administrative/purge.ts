import { oneLine } from "common-tags";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { Message, MessageReaction } from "discord.js";

export default class Purge extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "purge",
            group: "Administrative",
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
        const confirm = await message.channel.send(oneLine`
            This action will delete the last ${limit} messages.
            Are you sure you want to continue?
        `);

        confirm.react("🇾");
        confirm.react("🇳");

        const collected = await confirm.awaitReactions(
            (reaction: MessageReaction) =>
                ["🇾", "🇳"].includes(reaction.emoji.name) &&
                reaction.users.cache.some((user) => user.id === message.author.id),
            { time: 10000, max: 1 },
        );

        if (collected.first()) {
            if (collected.first().emoji.name === "🇾") {
                await message.channel.bulkDelete(limit);
            } else {
                await confirm.reactions.removeAll();
                await confirm.edit("Operation cancelled");
            }
        } else {
            await confirm.reactions.removeAll();
            await confirm.edit("Operation cancelled (you took too long to react)");
        }
    }
}
