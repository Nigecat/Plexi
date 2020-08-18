import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { confirm } from "../../../utils/misc";
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
        } catch (err) {
            message.channel.send(err.message);
            return;
        }

        // All pre-game checks should have passed if we get here
        // Next we confirm if the user is willing to accept the duel
        const confirmation = await message.channel.send(
            `${user}, ${message.author.username} is requesting to duel you. If you wish to accept react to this message with a 🇾.`,
            { allowedMentions: { users: [user.id] } },
        );
        // If the confirmation does not pass
        if (!(await confirm(user.id, confirmation))) {
            await confirmation.edit("Duel cancelled! (HINT: The duel request times out after not too long)");
            return;
        }

        await confirmation.delete();

        // Now both users should be wanting to duel
        // We can then get a bet for each user
        message.channel.send("BET START");
    }
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
    }
}
