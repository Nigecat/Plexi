import { oneLine } from "common-tags";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { Message, MessageReaction } from "discord.js";

export default class Purge extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "purge",
            group: "Administrative",
            description: "Delete the most recent <limit> messages in this channel. Max 50 messages at a time.",
            args: [
                {
                    name: "limit",
                    type: "number",
                },
            ],
        });
    }

    async run(message: Message, [limit]: [number]): Promise<void> {
        const confirm = await message.channel.send(oneLine`
            This action will delete the last ${limit} messages.
            Are you sure you want to continue?
        `);

        await confirm.react("🇾");
        await confirm.react("🇳");

        const collected = await confirm.awaitReactions(
            (reaction: MessageReaction) =>
                reaction.emoji.name === "regional_indicator_y" || reaction.emoji.name === "regional_indicator_n",
            { time: 10000 },
        );

        console.log(collected);
    }
}
