import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { stripIndents } from "common-tags";
import { Message, MessageReaction } from "discord.js";

export default class ClearUserData extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "clearuserdata",
            description: "Clear ALL data stored relating to you",
            details: stripIndents`
                This is IRREVERSIBLE and cannot be undone. 
                All cards and coins and any other data will be permanently reset.
            `,
            group: "General",
        });
    }

    async run(message: Message): Promise<void> {
        const confirm = await message.channel.send(stripIndents`
            This action will clear ALL data stored relating to you.
            This is IRREVERSIBLE and cannot be undone. 
            All cards and coins and any other data will be permanently reset.
            Are you sure you want to continue?
        `);

        await confirm.react("🇾");
        await confirm.react("🇳");

        const response = await confirm.awaitReactions(
            (reaction: MessageReaction) =>
                ["🇾", "🇳"].includes(reaction.emoji.name) &&
                reaction.users.cache.some((user) => user.id === message.author.id),
            { max: 1, time: 10000 },
        );

        if (response.size > 0) {
            if (response.first().emoji.name === "🇾") {
                await this.client.database.deleteUser(message.author.id);
                await confirm.delete();
                await message.channel.send("Your data has been cleared.");
            } else {
                await confirm.delete();
                await message.channel.send("Data deletion cancelled.");
            }
        } else {
            await confirm.delete();
            await message.channel.send("You took too long to confirm! Data deletion cancelled.");
        }
    }
}
