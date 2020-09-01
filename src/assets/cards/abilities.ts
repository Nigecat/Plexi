import { Message } from "discord.js";
import { clone } from "../../utils/clone";
import { getRandom } from "../../utils/misc";
import { Card } from "../../managers/CardManager";
import { GameUser } from "../../commands/extras/duel/GameUser";
import { GameState } from "../../commands/extras/duel/GameState";

export const abilities: Record<string, Ability> = {
    Commander: {
        name: "Commander",
        description: "Double the power of all other cards in the row this card is played to.",
        execute: async ({ turn, card }: GameData): Promise<string> => {
            turn.playedCards
                .filter((c) => c.type === card.type)
                .forEach((card) => {
                    card.power = card.power * 2;
                });
            return `All cards on ${turn.user.username}'s ${card.type} row have doubled their power!`;
        },
    },
    "More gun cat": {
        name: "More gun cat",
        description: "Automatically play any 'more gun cat' cards you have onto the field.",
        execute: async ({ turn, game }: GameData): Promise<string> => {
            const cards = turn.dbData.cards
                .filter((card) => card === "More gun cat")
                .map((name) => clone(game.client.cards.find((card) => card.name === name)));

            turn.playedCards.concat(cards);

            return `This played ${cards.length} cards!`;
        },
    },
    "Morale Boost": {
        name: "Morale Boost",
        description: "Raises the power of every other card in it's row by 1.",
        execute: async ({ turn, card }: GameData): Promise<string> => {
            turn.playedCards
                .filter((c) => c.type === card.type)
                .forEach((card) => {
                    card.power += 1;
                });
            return `All cards on ${turn.user.username}'s ${card.type} row have gained +1 power!`;
        },
    },
    "Tight Bond": {
        name: "Tight Bond",
        description: "Doubles its power each time you play the same card.",
        execute: async ({ game, turn }: GameData): Promise<string> => {
            // Find all the tight bond cards they have played
            const cards = turn.playedCards.filter((card) => card.ability.name === "Tight Bond");
            // Set each tight bond card's power to be the total number of tight bond cards times the original card power
            cards.forEach((card) => {
                card.power = cards.length * game.client.cards.find((c) => c.name === card.name).power;
            });
            return `This boosted ${cards.length} card(s)!`;
        },
    },
    Spy: {
        name: "Spy",
        description: "This card plays on the enemy's side of the field, but you get two random cards from your deck.",
        override: true,
        execute: async ({ game, turn, otherTurn, card }: GameData): Promise<string> => {
            // Add the card to the other user's played cards
            otherTurn.playedCards.push(card);

            try {
                // Pick two random cards from the person who played this cards deck,
                //  exclude any cards that have already been played (this round) or are in their hand already
                const cards = getRandom(
                    turn.dbData.deck.filter(
                        (card) =>
                            !turn.playedCards.map((card) => card.name).includes(card) &&
                            !turn.hand.map((card) => card.name).includes(card),
                    ),
                    2,
                );

                // Add each card to the user's hand after fetching the card object
                cards.forEach((card) => {
                    turn.hand.push(game.client.cards.get(card));
                });

                return `${card.name} played on the opposite side of the field, ${turn.user.username} recieved 2 cards!`;
            } catch {
                return "I could not take 2 cards out of your deck, you have played all of them (or they are already in your hand).";
            }
        },
    },
    Medic: {
        name: "Medic",
        description: "Draws a random card from your deck.",
        execute: async ({ game, turn }: GameData): Promise<string> => {
            try {
                // Get a random card from their deck
                //  and exclude any cards that have already been played (this round) or are in their hand already
                const card = getRandom(
                    turn.dbData.deck.filter(
                        (card) =>
                            !turn.playedCards.map((card) => card.name).includes(card) &&
                            !turn.hand.map((card) => card.name).includes(card),
                    ),
                    1,
                )[0];

                // Add it to their hand
                turn.hand.push(game.client.cards.get(card));

                return `${turn.user.username} drew an extra card!`;
            } catch {
                return "I could not take a card out of your deck, you have played all of them (or they are already in your hand)";
            }
        },
    },
    Agile: {
        name: "Agile",
        description: "You get to decide whether this card plays to the Melee or Scout position.",
        execute: async ({ game, card, turn }: GameData): Promise<string> => {
            game.channel.send(
                `${turn.user.username}, please type either 'melee' or 'scout' for the position you want to play this card.`,
            );
            // Wait for them to send the position
            const messages = await game.channel.awaitMessages(
                (message: Message) =>
                    message.author.id === turn.user.id && ["melee", "scout"].includes(message.content.toLowerCase()),
                { max: 1 },
            );
            // Figure out which one it was and update the card
            const position = messages.first().content;
            if (position.toLowerCase() === "melee") {
                card.type = "Melee";
            } else if (position.toLowerCase() === "scout") {
                card.type = "Scout";
            }
            return `It played as a ${card.type} card!`;
        },
    },
};

interface GameData {
    /** The current state of the game */
    game: GameState;
    /** The user who played this card (it is their turn) */
    turn: GameUser;
    /** The other user */
    otherTurn: GameUser;
    /** The card that was played */
    card: Card;
}

export interface Ability {
    /** The name of this ability */
    name: string;
    /** The scription of this ability */
    description: string;
    /** Whether to override the default card assignment */
    override?: boolean;
    /** A function to run this ability, this should modify the objects passed to it */
    execute: (data: GameData) => Promise<string>;
}
