import { Plexi } from "../../../Plexi";
import ArgumentTypes from "../../types";
import { Command } from "../../Command";
import { stripIndents } from "common-tags";
import { Card } from "../../../managers/CardManager";
import { ZERO_WIDTH_SPACE } from "../../../constants";
import { confirm, getRandom } from "../../../utils/misc";
import { User } from "../../../managers/DatabaseManager";
import {
    Message,
    User as DiscordUser,
    TextChannel,
    NewsChannel,
    MessageEmbed,
    DMChannel,
    MessageReaction,
} from "discord.js";

/*
Known issues:
The user gets cached so if it updates during the setup process things break
Fix:
    Make it an async getter and await it whenever we get it, re-request the data every time
*/

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
        const game = new GameState(
            this.client,
            (message.channel as unknown) as TextChannel | NewsChannel,
            message.author,
            user,
        );

        // Init the game and run all pre-game checks
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

        // Now that both users should be wanting to duel
        // We can then get a bet for each user
        try {
            await game.getBet();
        } catch (err) {
            message.channel.send("The duel has been cancelled.");
            return;
        }

        // Confirm the bets
        const betConfirm = await message.channel.send(
            stripIndents`
                **Current bets are:**
                ${message.author}: ${game.initiator.bet}
                ${user}: ${game.target.bet}

                Could both users now react with whether they agree with this bet. 
                If either user reacts with 🇳 the duel will be cancelled. 
            `,
            { allowedMentions: { users: [message.author.id, user.id] } },
        );
        await betConfirm.react("🇾");
        await betConfirm.react("🇳");
        const response = await betConfirm.awaitReactions(
            (reaction: MessageReaction) =>
                ["🇾", "🇳"].includes(reaction.emoji.name) &&
                reaction.users.cache.some(
                    (reactUser) => reactUser.id === message.author.id || reactUser.id === user.id,
                ),
            { max: 2 },
        );

        await message.reactions.removeAll();
        await betConfirm.delete();

        // If any of the reactions aren't yes
        if (!response.every((emoji: MessageReaction) => emoji.emoji.name === "🇾")) {
            message.channel.send("Duel cancelled!");
            return;
        }

        // Finally start the game
        const embed = new MessageEmbed({
            color: "#ff0000",
            title: `⚔️ Initiating duel between ${message.author.username} and ${user.username}⚔️`,
            description: "TODO: Duel instructions",
        });
        await message.channel.send({ embed });
        game.start();
    }
}

class GameUser {
    public dbData: User;
    public dmChannel: DMChannel;
    public hand: Card[];
    public playedCards: Card[];
    public deckContent: Message;
    // Users may bet either a card or coins
    public bet: string | number;

    constructor(public client: Plexi, public user: DiscordUser) {}

    async init(): Promise<void> {
        this.dbData = await this.client.database.getUser(this.user.id);
    }
}

class GameState {
    // The user who started the duel
    public initiator: GameUser;
    // The user who the duel was started against
    public target: GameUser;

    constructor(
        public client: Plexi,
        public channel: TextChannel | NewsChannel,
        initiator: DiscordUser,
        target: DiscordUser,
    ) {
        this.initiator = new GameUser(this.client, initiator);
        this.target = new GameUser(this.client, target);
    }

    /** Initialise the game, this will throw any errors if we cannot proceed with the game */
    async init(): Promise<void> {
        // Load both our users from the database
        await this.initiator.init();
        await this.target.init();

        // Don't allow users to duel themselves
        if (this.initiator.user.id === this.target.user.id) {
            throw new Error("You can't duel yourself!");
        }

        // Don't allow users to duel bots
        if (this.target.user.bot) {
            throw new Error("You can't duel a bot!");
        }

        // Ensure both users have 20 cards in their deck
        if (this.initiator.dbData.deck.length !== 20) {
            throw new Error("You do not have 20 cards in your deck! Run `addcard <card>` to move a card to your deck.");
        }
        if (this.initiator.dbData.deck.length !== 20) {
            throw new Error("The person you are trying to duel does not have 20 cards in their deck!");
        }
    }

    /** Get the user bets */
    async getBet(): Promise<void> {
        const embed = new MessageEmbed({
            title: "Place your bets",
            color: "RANDOM",
            description: stripIndents`
                Both users must now place a bet. 
                The bet can either be a card or coins.
                The loser gets their bet transferred to the winner.
                In the case of a draw nothing happens.
                Each user must direct message me their bet.
                Please decide on this prior to sending me messages, after I have recieved both I will display them with a confirmation.

                E.g if you wanted to bet the standard cat card you can just dm me 'standard cat'. 
                If you wanted to bet 5 coins it would just be '5'.

                I will send a confirmation message here once I recieve both bets.
                Either user can dm me 'cancel' during this process to call off the duel.
            `,
        });
        await this.channel.send({ embed });

        // Get the bets of both users
        await Promise.all([
            GameState.getUserBet(this.client, this.initiator),
            GameState.getUserBet(this.client, this.target),
        ]);
    }

    /** Start the game, assumes prior setup is complete */
    async start(): Promise<void> {
        // Helper function to generate the deck text from an array of cards
        const generateDeckText = (user: GameUser) => stripIndents`
            Here is your hand, these cards have been randomly drawn from your deck.
            This message will be automatically updated to reflect the current contents of your deck.
            Check back here at any time to see your deck.

            ${user.hand.map((card) => `${card.name} (${card.type}) - ${card.power} power`).join("\n")}
        `;

        // Helper function to swap a turn
        const swapTurn = (user: GameUser) => (user.user.id === this.initiator.user.id ? this.target : this.initiator);

        // Randomly decide who is going first
        const turn = Math.random() >= 0.5 ? this.initiator : this.target;

        // Assign each user 5 random cards from their deck
        this.initiator.hand = getRandom(this.initiator.dbData.deck, 5).map((card) => this.client.cards.get(card));
        this.target.hand = getRandom(this.target.dbData.deck, 5).map((card) => this.client.cards.get(card));

        // Send each user their deck
        this.initiator.deckContent = await this.initiator.dmChannel.send(generateDeckText(this.initiator));
        this.target.deckContent = await this.target.dmChannel.send(generateDeckText(this.initiator));

        // Create the game board embed
        const embed = new MessageEmbed({
            color: "RANDOM",
            title: `${this.initiator.user.username} | ${this.target.user.username}`,
            footer: { text: `Total power: 0 | 0` },
            fields: [
                {
                    name: "Melee",
                    value: ZERO_WIDTH_SPACE,
                    inline: true,
                },
                {
                    name: "Melee",
                    value: ZERO_WIDTH_SPACE,
                    inline: true,
                },
                {
                    name: ZERO_WIDTH_SPACE,
                    value: ZERO_WIDTH_SPACE,
                },
                {
                    name: "Scout",
                    value: ZERO_WIDTH_SPACE,
                    inline: true,
                },
                {
                    name: "Scout",
                    value: ZERO_WIDTH_SPACE,
                    inline: true,
                },
                {
                    name: ZERO_WIDTH_SPACE,
                    value: ZERO_WIDTH_SPACE,
                },
                {
                    name: "Defense",
                    value: ZERO_WIDTH_SPACE,
                    inline: true,
                },
                {
                    name: "Defense",
                    value: ZERO_WIDTH_SPACE,
                    inline: true,
                },
            ],
        });

        await this.channel.send("Here is the game board, this will automatically be edited as the game progresses:", {
            embed,
        });

        // TODO: Main game loop
    }

    /** Get a user bet, this will also cache the dm channel of the user in the GameUser object
     *  and modify the user object to have the bet in it */
    private static async getUserBet(client: Plexi, user: GameUser): Promise<void> {
        // Send a message to the user, this allows us to cache their dm channel
        user.dmChannel = ((
            await user.user.send(stripIndents`
                Hey! I'm just dragging this dm to the top of your list.
                Please respond with your bet.
            `)
        ).channel as unknown) as DMChannel;

        return new Promise((resolve, reject) => {
            const initiatorCollector = user.dmChannel.createMessageCollector(() => true);
            initiatorCollector.on("collect", (message: Message) => {
                // Ignore any other users (to stop the bot from responding to itself)
                if (message.author.id !== user.user.id) return;

                // If the user cancelled it reject the promise
                if (message.content.toLowerCase() === "cancel") {
                    message.channel.send("❌ Duel cancelled");
                    initiatorCollector.emit("end");
                    reject();
                }

                // If this card exists
                else if (client.cards.has(message.content)) {
                    const card = client.cards.get(message.content);
                    // If this user has that card
                    if (user.dbData.cards.includes(card.name)) {
                        message.channel.send(`✅ Bet recieved (${card.name})`);
                        user.bet = card.name;
                        initiatorCollector.emit("end");
                        resolve();
                    } else {
                        message.channel.send(
                            "You don't have that card! (NOTE: You can't bet a card in your active deck)",
                        );
                    }
                }

                // If this is a valid number
                else if (ArgumentTypes.number.validate(message.content)) {
                    const coins: number = ArgumentTypes.number.parse(message.content);
                    // If this user has enough coins
                    if (user.dbData.coins >= coins) {
                        message.channel.send(`✅ Bet recieved (${coins} coins)`);
                        user.bet = coins;
                        initiatorCollector.emit("end");
                        resolve();
                    } else {
                        message.channel.send(
                            `You don't have enough coins to bet that much! (You have ${user.dbData.coins} coins)`,
                        );
                    }
                } else {
                    message.channel.send("That card doesn't exist! (Or that is not a valid coin count)");
                }
            });
        });
    }
}
