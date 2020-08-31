import { GameUser } from "./GameUser";
import { Plexi } from "../../../Plexi";
import ArgumentTypes from "../../types";
import cloneDeep from "lodash/cloneDeep";
import { getRandom } from "../../../utils/misc";
import { stripIndents, oneLine } from "common-tags";
import { Card } from "../../../managers/CardManager";
import { ZERO_WIDTH_SPACE } from "../../../constants";
import { Message, User as DiscordUser, TextChannel, NewsChannel, MessageEmbed, DMChannel } from "discord.js";

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
                Either user can dm me \`cancel\` during this process to call off the duel.
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
                        turn.hand.splice(turn.hand.map((card) => card.name).indexOf(card.name), 1);
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

                // Otherwise no one won this round so we can check the auto passes again
                else {
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
