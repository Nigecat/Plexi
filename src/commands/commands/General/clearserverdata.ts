import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { stripIndents } from "common-tags";
import { Message, MessageReaction } from "discord.js";

export default class ClearServerData extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "clearserverdata",
            description: "Clear ALL data stored relating to this server",
            details: stripIndents`
                This is IRREVERSIBLE and cannot be undone. 
                All autoroles and prefix settings and any other data will be permanently reset.
            `,
            guildOnly: true,
            group: "General",
            userPermissions: ["ADMINISTRATOR"],
        });
    }

    async run(message: Message): Promise<void> {
        // Only allow the guild owner to run this command
        if (message.author.id !== message.guild.ownerID) {
            message.channel.send("Only the server owner may run this command!");
        } else {
            const confirm = await message.channel.send(stripIndents`
                This action will clear ALL data stored relating to this server.
                This is IRREVERSIBLE and cannot be undone. 
                All autoroles and prefix settings and any other data will be permanently reset.
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
                    await this.client.database.deleteGuild(message.guild.id);
                    await confirm.delete();
                    await message.channel.send("This server's data has been cleared.");
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
}
