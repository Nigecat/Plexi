import { Plexi } from "../../../Plexi";
import ArgumentTypes from "../../types";
import { Command } from "../../Command";
import cloneDeep from "lodash/cloneDeep";
import { stripIndents, oneLine } from "common-tags";
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

export default class Duel extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "duel",
            group: "Catrd",
            description: "Fight another user in the ring of honor!",
            details: stripIndents`
                Fight another user, at the start of the duel both users place a bet.
                This bet can either be coins of a card.
                The winner takes the loser's bet.

                When a duel is started, 7 cards will be picked at random from your deck (run \`mycards\` to view your deck).
            `,
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
            // Unlock the accounts
            await game.initiator.unlock();
            await game.target.unlock();
            return;
        }

        await message.channel.send({
            embed: {
                color: "#ff0000",
                description: stripIndents`
                    NOTE: While you are in a duel, your user account gets locked.
                    Any changes to your cards, coins or other data **WILL NOT** go through.
                    It may look like it went through but no changes will be applied.
                `,
            },
        });

        // All pre-game checks should have passed if we get here
        // Next we confirm if the user is willing to accept the duel
        const confirmation = await message.channel.send(
            `${user}, ${message.author.username} is requesting to duel you. If you wish to accept react to this message with a 🇾.`,
            { allowedMentions: { users: [user.id] } },
        );
        // If the confirmation does not pass
        if (!(await confirm(user.id, confirmation))) {
            await confirmation.edit("Duel cancelled! (HINT: The duel request times out after not too long)");
            // Unlock the accounts
            await game.initiator.unlock();
            await game.target.unlock();
            return;
        }

        await confirmation.delete();

        // Now that both users should be wanting to duel
        // We can then get a bet for each user
        try {
            await game.getBet();
        } catch (err) {
            message.channel.send("The duel has been cancelled.");
            // Unlock the accounts
            await game.initiator.unlock();
            await game.target.unlock();
            return;
        }

        // Confirm the bets
        const betConfirm = await message.channel.send(
            stripIndents`
                **Current bets are:**
                ${message.author}: ${
                typeof game.initiator.bet === "number" ? `${game.initiator.bet} coins` : game.initiator.bet
            }
                ${user}: ${typeof game.target.bet === "number" ? `${game.target.bet} coins` : game.target.bet}

                Could both users now react with whether they agree with this bet. 
                If either user reacts with 🇳 the duel will be cancelled. 
            `,
            { allowedMentions: { users: [message.author.id, user.id] } },
        );
        await betConfirm.react("🇾");
        await betConfirm.react("🇳");
        const response = await betConfirm.awaitReactions(
            (reaction: MessageReaction, reactUser: DiscordUser) =>
                ["🇳", "🇾"].includes(reaction.emoji.name) && [message.author.id, user.id].includes(reactUser.id),
            { max: 2, time: 60000 },
        );

        await betConfirm.reactions.removeAll();

        // If any of the reactions aren't yes or we don't get enough of them
        if (
            response.has("🇳") &&
            response.get("🇳").users.cache.filter((user) => [message.author.id, user.id].includes(user.id)).size > 0
        ) {
            await betConfirm.edit("Duel cancelled! (HINT: The bet confirmation times out after not too long)");
            // Unlock the accounts
            await game.initiator.unlock();
            await game.target.unlock();
            return;
        }

        // Finally start the game
        const embed = new MessageEmbed({
            color: "#ff0000",
            title: `⚔️  Initiating duel between ${message.author.username} and ${user.username}  ⚔️`,
            description: stripIndents`
                So... how does this work?
                
                Both duel participants will have now been sent a list of 7 cards, this is your hand.
                The game is turn based, the current turn is displayed at the bottom of the game board.
                The game board will be updated as the game progressing. Keep an eye on it.
                The game has 'rounds', and round ends when both users have passed.
    
                When it is your turn, playing a card is as simple as typing the name of the card into the channel where the board is.
                To pass just type 'pass' in the channel where the board is.
                If a user runs out of cards in their hand they will automatically pass.
                Once both users have passed, the user with the highest current total power on their side of the board will win the round. (This is the accumulative power of all the cards on their side)
                
                The total round wins can be seen at the top of the board next to the usernames.
                The total played power is at the bottom.

                Certain cards may have abilities that have side effects once played. 
                These will be marked in the hand you were sent. Run \`abilityinfo\` to check what an ability does (this works in dms).
                
                Whoever has the current turn may type \`refresh\` in the this channel to send a new message with the board.
                This is for longer duels so you don't have to scroll upwards as far.

                The first user to two round wins will win the overall game.
                Good luck!
            `,
        });
        await message.channel.send({ embed });
        game.start();
    }
}

export class GameUser {
    public dbData: User;
    public dmChannel: DMChannel;
    public hand: Card[];
    public playedCards: Card[];
    public deckContent: Message;
    public wins: number;
    public passed: boolean;
    // Users may bet either a card or coins
    public bet: string | number;

    constructor(public client: Plexi, public user: DiscordUser) {
        this.wins = 0;
        this.passed = false;
        this.playedCards = [];
    }

    async init(): Promise<void> {
        // Lock the user account
        this.dbData = await this.client.database.getUser(this.user.id);
    }

    async lock(): Promise<void> {
        await this.client.database.updateUser(this.user.id, "lock", true);
    }

    async unlock(): Promise<void> {
        await this.client.database.updateUser(this.user.id, "lock", false);
    }
}

export class GameState {
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
        if (this.target.dbData.deck.length !== 20) {
            throw new Error("The person you are trying to duel does not have 20 cards in their deck!");
        }

        // Ensure neither user is already in a duel
        if (this.initiator.dbData.lock) {
            throw new Error("You are already in a duel!");
        }
        if (this.target.dbData.lock) {
            throw new Error("The person you are trying to duel is already in a duel!");
        }

        // Lock the users
        await this.initiator.lock();
        await this.target.lock();
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

        const msg = await this.channel.send({ embed });

        // Get the bets of both users
        try {
            await Promise.all([
                GameState.getUserBet(this.client, this.initiator),
                GameState.getUserBet(this.client, this.target),
            ]);
        } finally {
            await msg.delete();
        }
    }

    /** Start the game, assumes prior setup is complete */
    async start(): Promise<void> {
        // Helper function to generate the deck text from an array of cards
        const generateDeckText = (user: GameUser) => stripIndents`
            Here is your hand, these cards have been randomly drawn from your deck.
            This message will be automatically updated to reflect the current contents of your deck.
            Check back here at any time to see your deck.

            ${user.hand
                .map(
                    (card) =>
                        `${card.name} (${card.type}) - ${card.power} power ${
                            card.ability ? `| Ability: ${card.ability.name}` : ""
                        }`,
                )
                .join("\n")}
        `;

        // Helper function to swap a turn
        const swapTurn = (user: GameUser) => (user.user.id === this.initiator.user.id ? this.target : this.initiator);

        // Helper function to calculate the total power of an array of cards
        const totalPower = (cards: Card[]) => cards.reduce((total, card) => total + card.power, 0);

        // Helper function to regenerate the board
        const regenerateBoard = () => {
            return new MessageEmbed({
                color: "RANDOM",
                title: `${this.initiator.user.username} (${this.initiator.wins}) | ${this.target.user.username} (${this.target.wins})`,
                footer: {
                    text: oneLine`
                        Total power: ${totalPower(this.initiator.playedCards)} | 
                        ${totalPower(this.target.playedCards)}, Current turn: ${turn.user.username}`,
                },
                fields: [
                    {
                        name: "Melee",
                        value:
                            this.initiator.playedCards
                                .filter((card) => card.type === "Melee")
                                .map(({ name }) => name)
                                .join("\n") || ZERO_WIDTH_SPACE,
                        inline: true,
                    },
                    {
                        name: "Melee",
                        value:
                            this.target.playedCards
                                .filter((card) => card.type === "Melee")
                                .map(({ name }) => name)
                                .join("\n") || ZERO_WIDTH_SPACE,
                        inline: true,
                    },
                    {
                        name: ZERO_WIDTH_SPACE,
                        value: ZERO_WIDTH_SPACE,
                    },
                    {
                        name: "Scout",
                        value:
                            this.initiator.playedCards
                                .filter((card) => card.type === "Scout")
                                .map(({ name }) => name)
                                .join("\n") || ZERO_WIDTH_SPACE,
                        inline: true,
                    },
                    {
                        name: "Scout",
                        value:
                            this.target.playedCards
                                .filter((card) => card.type === "Scout")
                                .map(({ name }) => name)
                                .join("\n") || ZERO_WIDTH_SPACE,
                        inline: true,
                    },
                    {
                        name: ZERO_WIDTH_SPACE,
                        value: ZERO_WIDTH_SPACE,
                    },
                    {
                        name: "Defense",
                        value:
                            this.initiator.playedCards
                                .filter((card) => card.type === "Defense")
                                .map(({ name }) => name)
                                .join("\n") || ZERO_WIDTH_SPACE,
                        inline: true,
                    },
                    {
                        name: "Defense",
                        value:
                            this.target.playedCards
                                .filter((card) => card.type === "Defense")
                                .map(({ name }) => name)
                                .join("\n") || ZERO_WIDTH_SPACE,
                        inline: true,
                    },
                ],
            });
        };

        // Assign each user 7 random cards from their deck
        this.initiator.hand = getRandom(this.initiator.dbData.deck, 7).map((card) => this.client.cards.get(card));
        this.target.hand = getRandom(this.target.dbData.deck, 7).map((card) => this.client.cards.get(card));

        // Randomly decide who is going first
        let turn = Math.random() >= 0.5 ? this.initiator : this.target;

        // Send each user their deck
        this.initiator.deckContent = await this.initiator.dmChannel.send(generateDeckText(this.initiator));
        this.target.deckContent = await this.target.dmChannel.send(generateDeckText(this.target));

        // Create the game board embed
        const originalBoardFields = [
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
        ];

        let board = await this.channel.send({
            embed: {
                color: "RANDOM",
                title: `${this.initiator.user.username} (0) | ${this.target.user.username} (0)`,
                footer: { text: `Total power: 0 | 0, Current turn: ${turn.user.username}` },
                fields: originalBoardFields,
            },
        });

        // Main game logic;
        // We want to recieve every message both users send
        const collector = this.channel.createMessageCollector(
            (message: Message) =>
                message.author.id === this.initiator.user.id || message.author.id === this.target.user.id,
        );

        // Delete the board and dms once the game finishes
        collector.on("end", () => {
            board.delete();
            this.initiator.deckContent.delete();
            this.target.deckContent.delete();
        });

        // Set a timeout of 15 minutes as a game timeout
        // Users do not know this exists
        setTimeout(async () => {
            // If the duel has not ended after 15 minutes
            if (!collector.ended) {
                // End it
                collector.stop();
                // Unlock the accounts
                await this.initiator.unlock();
                await this.target.unlock();
                // Let the users know
                this.channel.send(
                    oneLine`
                        Duel between ${this.initiator.user} and ${this.target.user} has timed out. 
                        (Duels have a max time limit of 15 minutes!)
                    `,
                    { allowedMentions: { users: [this.initiator.user.id, this.target.user.id] } },
                );
            }
        }, 900000);

        // This runs every time either the initiator or target sends a message in the game channel
        collector.on("collect", async (message: Message) => {
            // If this message came from the current turn user
            if (message.author.id === turn.user.id) {
                // If this is a pass
                if (message.content.toLowerCase() === "pass") {
                    turn.passed = true;
                    this.channel.send("You have passed!");
                    turn = swapTurn(turn);
                }

                // If this is a board refresh
                else if (message.content.toLowerCase() === "refresh") {
                    // Regenerate the board embed in a new message
                    const newBoard = regenerateBoard();
                    await board.delete();
                    board = await this.channel.send({ embed: newBoard });
                }

                // If this message came from the current turn user and is a valid card
                else if (message.author.id === turn.user.id && this.client.cards.has(message.content)) {
                    // Perform a deep clone so our abilities can modify this card
                    const card = cloneDeep(this.client.cards.get(message.content));
                    // If this user has that card in their hand
                    if (turn.hand.map(({ name }) => name.toLowerCase()).includes(card.name.toLowerCase())) {
                        // Only put the card in their played cards if we don't have an ability or we don't have an override
                        if (!card.ability || (card.ability && !card.ability.override)) {
                            // Add the card to their played cards
                            turn.playedCards.push(card);
                        }
                        // Remove the card from their hand
                        turn.hand.splice(turn.hand.indexOf(card), 1);
                        // Let the user know
                        await this.channel.send(`${turn.user.username} has played: ${card.name}`);
                        // Execute the ability of the card if it exists
                        if (card.ability) {
                            await message.channel.send(`${card.name} triggered it's ability - ${card.ability.name}!`);
                            await message.channel.send(
                                await card.ability.execute({ game: this, turn, card, otherTurn: swapTurn(turn) }),
                            );
                        }
                        // Update the hand for the user
                        turn.deckContent = await turn.deckContent.edit(generateDeckText(turn));
                        // Flip the turn only if the other user has not passed
                        if (!swapTurn(turn).passed) turn = swapTurn(turn);
                        // Regenerate the board embed
                        const newBoard = regenerateBoard();
                        await board.edit({ embed: newBoard });
                    } else {
                        this.channel.send(
                            "You don't have that card in your hand! (HINT: Check your dms with me to view your hand)",
                        );
                    }
                }

                // Auto pass if either user is out of cards
                if (
                    this.initiator.user.id === turn.user.id &&
                    this.initiator.hand.length === 0 &&
                    !this.initiator.passed
                ) {
                    this.initiator.passed = true;
                    this.channel.send(
                        `${this.initiator.user.username} has automatically passed since they do not have any cards left in their hand.`,
                    );
                    turn = swapTurn(turn);
                    // Regenerate the board embed
                    const newBoard = regenerateBoard();
                    await board.edit({ embed: newBoard });
                }
                if (this.target.user.id === turn.user.id && this.target.hand.length === 0 && !this.target.passed) {
                    this.target.passed = true;
                    this.channel.send(
                        `${this.target.user.username} has automatically passed since they do not have any cards left in their hand.`,
                    );
                    turn = swapTurn(turn);
                    // Regenerate the board embed
                    const newBoard = regenerateBoard();
                    await board.edit({ embed: newBoard });
                }

                // If both users have now passed
                if (this.initiator.passed && this.target.passed) {
                    // Check who has the highest total power
                    const initiatorPower = totalPower(this.initiator.playedCards);
                    const targetPower = totalPower(this.target.playedCards);

                    // If the round is a draw
                    if (initiatorPower === targetPower) {
                        this.channel.send("This round is a draw.");
                        this.initiator.wins += 1;
                        this.target.wins += 1;
                    }
                    // If the initiator won
                    else if (initiatorPower > targetPower) {
                        this.channel.send(`${this.initiator.user.username} has won the round!`);
                        this.initiator.wins += 1;
                    }
                    // If the target won
                    else {
                        this.channel.send(`${this.target.user.username} has won the round!`);
                        this.target.wins += 1;
                    }

                    // Reset the board
                    this.initiator.playedCards = [];
                    this.target.playedCards = [];
                    this.initiator.passed = false;
                    this.target.passed = false;
                    await board.delete();
                    board = await this.channel.send({
                        embed: {
                            color: "RANDOM",
                            title: `${this.initiator.user.username} (${this.initiator.wins}) | ${this.target.user.username} (${this.target.wins})`,
                            footer: { text: `Total power: 0 | 0, Current turn: ${turn.user.username}` },
                            fields: originalBoardFields,
                        },
                    });

                    // If both user have 2 wins (game end as a draw)
                    if (this.initiator.wins === 2 && this.target.wins === 2) {
                        collector.stop();
                        this.channel.send("Duel over - this duel is a draw!");
                        // Unlock the accounts
                        await this.initiator.unlock();
                        await this.target.unlock();
                    }

                    // Check if a user has gotten 2 wins (this signifies a game end)
                    else if (this.initiator.wins >= 2) {
                        collector.stop();
                        // Unlock the accounts
                        await this.initiator.unlock();
                        await this.target.unlock();
                        this.channel.send(
                            oneLine`
                                ${this.initiator.user} has won the duel! 
                                They will now recieve ${
                                    typeof this.target.bet === "number" ? `${this.target.bet} coins` : this.target.bet
                                }
                            `,
                            { allowedMentions: { users: [this.initiator.user.id] } },
                        );
                        // If this was a coin bet
                        if (typeof this.target.bet === "number") {
                            // Apply the changes
                            await this.client.database.updateUser(
                                this.initiator.user.id,
                                "coins",
                                this.initiator.dbData.coins + this.target.bet,
                            );
                            await this.client.database.updateUser(
                                this.target.user.id,
                                "coins",
                                this.target.dbData.coins - this.target.bet,
                            );
                        }
                        // Otherwise we can assume it is a card bet
                        else {
                            // Apply the changes
                            this.initiator.dbData.cards.push(this.target.bet);
                            this.target.dbData.cards.splice(this.target.dbData.cards.indexOf(this.target.bet), 1);
                            await this.client.database.updateUser(
                                this.initiator.user.id,
                                "cards",
                                this.initiator.dbData.cards,
                            );
                            await this.client.database.updateUser(
                                this.target.user.id,
                                "cards",
                                this.target.dbData.cards,
                            );
                        }
                    } else if (this.target.wins >= 2) {
                        collector.stop();
                        // Unlock the accounts
                        await this.initiator.unlock();
                        await this.target.unlock();
                        this.channel.send(
                            oneLine`
                                ${this.target.user} has won the duel! 
                                They will now recieve ${
                                    typeof this.initiator.bet === "number"
                                        ? `${this.initiator.bet} coins`
                                        : this.initiator.bet
                                }
                            `,
                            { allowedMentions: { users: [this.target.user.id] } },
                        );
                        // If this was a coin bet
                        if (typeof this.initiator.bet === "number") {
                            // Apply the changes
                            await this.client.database.updateUser(
                                this.target.user.id,
                                "coins",
                                this.target.dbData.coins + this.initiator.bet,
                            );
                            await this.client.database.updateUser(
                                this.initiator.user.id,
                                "coins",
                                this.initiator.dbData.coins - this.initiator.bet,
                            );
                        }
                        // Otherwise we can assume it is a card bet
                        else {
                            // Apply the changes
                            this.target.dbData.cards.push(this.initiator.bet);
                            this.initiator.dbData.cards.splice(
                                this.initiator.dbData.cards.indexOf(this.initiator.bet),
                                1,
                            );
                            await this.client.database.updateUser(
                                this.target.user.id,
                                "cards",
                                this.target.dbData.cards,
                            );
                            await this.client.database.updateUser(
                                this.initiator.user.id,
                                "cards",
                                this.initiator.dbData.cards,
                            );
                        }
                    }
                }
            }
        });
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
                    initiatorCollector.stop();
                    reject();
                }

                // If this card exists
                else if (client.cards.has(message.content)) {
                    const card = client.cards.get(message.content);
                    // If this user has that card
                    if (user.dbData.cards.includes(card.name)) {
                        message.channel.send(`✅ Bet recieved (${card.name})`);
                        user.bet = card.name;
                        initiatorCollector.stop();
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
                        initiatorCollector.stop();
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
