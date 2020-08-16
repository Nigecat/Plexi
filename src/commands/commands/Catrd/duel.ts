import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { User } from "../../../managers/DatabaseManager";
import { Message, User as DiscordUser, MessageReaction, MessageEmbed } from "discord.js";

export default class Duel extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "duel",
            group: "Catrd",
            description: "TODO",
            guildOnly: true,
            details: "TODO",
            args: [
                {
                    name: "user",
                    type: "user",
                },
            ],
        });
    }

    async run(message: Message, [user]: [DiscordUser]): Promise<void> {
        const user1 = await this.client.database.getUser(message.author.id);
        const user2 = await this.client.database.getUser(user.id);
        // If all the checks pass for us to start
        if (this.ensureStart(message, user, user1, user2)) {
            // Confirm the user actually wants to duel
            const confirmStart = await message.channel.send(
                `${user}, ${message.author} is requesting to duel you. If you wish to accept react with 🇾 to this message.`,
                { allowedMentions: { users: [user.id] } },
            );

            await confirmStart.react("🇾");
            await confirmStart.react("🇳");

            const response = await confirmStart.awaitReactions(
                (reaction: MessageReaction) =>
                    ["🇾", "🇳"].includes(reaction.emoji.name) &&
                    reaction.users.cache.some((reactUser) => reactUser.id === user.id),
                { max: 1, time: 25000 },
            );

            await confirmStart.reactions.removeAll();

            if (response.size > 0) {
                if (response.first().emoji.name === "🇾") {
                    // Start the duel
                    if (confirmStart.deletable) await confirmStart.delete();
                    const embed = new MessageEmbed({
                        color: "#ff0000",
                        title: `⚔️ Initiating duel between ${message.author.username} and ${user.username} ⚔️`,
                    });
                    message.channel.send({ embed });
                } else {
                    await confirmStart.edit("Duel cancelled.");
                }
            } else {
                await confirmStart.edit(`${user} took to long to respond! Duel cancelled.`);
            }
        }
    }

    ensureStart(message: Message, user: DiscordUser, user1: User, user2: User): boolean {
        // Don't allow users to duel themselves
        if (message.author.id === user.id) {
            message.channel.send("You can't duel yourself!");
            return false;
        }

        // Don't allow users to duel bots
        if (user.bot) {
            message.channel.send("You can't duel a bot!");
            return false;
        }

        // Ensure both users have 20 cards in their deck
        if (user1.deck.length !== 20) {
            message.channel.send(
                "You do not have 20 cards in your deck! Run `addcard <card>` to move a card to your deck.",
            );
            return false;
        }
        if (user2.deck.length !== 20) {
            message.channel.send(`${message.author} does not have 20 cards in their deck!`);
            return false;
        }

        return true;
    }
}
