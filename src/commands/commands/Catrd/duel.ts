import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { User } from "../../../managers/DatabaseManager";
import { Message, User as DiscordUser, Channel } from "discord.js";

export default class Duel extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "duel",
            group: "Catrd",
            description: "TODO",
            details: "TODO",
            guildOnly: true,
            args: [
                {
                    name: "user",
                    type: "user",
                },
            ],
        });
    }

    async run(message: Message, [user]: [DiscordUser]): Promise<void> {
        const game = new GameState(this.client, message.channel, message.author, user);
        try {
            await game.init();
            message.channel.send("Game ready!");
        } catch (err) {
            message.channel.send(err.message);
        }
    }

    /* Old Code:
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
    */
}

class GameState {
    public user1: User;
    public user2: User;

    constructor(
        public client: Plexi,
        public channel: Channel,
        public initiator: DiscordUser,
        public target: DiscordUser,
    ) {}

    /** Initialise the game, this will throw any errors if we cannot proceed with the game */
    async init(): Promise<void> {
        // Load both our users from the database
        this.user1 = await this.client.database.getUser(this.initiator.id);
        this.user2 = await this.client.database.getUser(this.target.id);

        // Don't allow users to duel themselves
        if (this.initiator.id === this.target.id) {
            throw new Error("You can't duel yourself!");
        }

        // Don't allow users to duel bots
        if (this.target.bot) {
            throw new Error("You can't duel a bot!");
        }

        // Ensure both users have 20 cards in their deck
        if (this.user1.deck.length !== 20) {
            throw new Error("You do not have 20 cards in your deck! Run `addcard <card>` to move a card to your deck.");
        }
        if (this.user2.deck.length !== 20) {
            throw new Error("The person you are trying to duel does not have 20 cards in their deck!");
        }

        // We should be all good to obtain the user bets now
    }
}
