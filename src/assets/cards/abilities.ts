import { Card } from "../../managers/CardManager";
import { GameState, GameUser } from "../../commands/commands/Catrd/duel";

export const abilities: Record<string, Ability> = {
    "Morale Boost": {
        name: "Morale Boost",
        description: "Raises the power of every other card in it's row by 1.",
        execute: async ({ turn, card }: AbilityData): Promise<string> => {
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
        execute: async ({ game, turn }: AbilityData): Promise<string> => {
            // Find all the tight bond cards they have played
            const cards = turn.playedCards.filter((card) => card.ability.name === "Tight Bond");
            // Set each tight bond card's power to be the total number of tight bond cards times the original card power
            cards.forEach((card) => {
                card.power = cards.length * game.client.cards.find((c) => c.name === card.name).power;
            });
            return `This boosted ${cards.length} cards!`;
        },
    },
    /*
    Medic: {
        name: "Medic",
        description: "Brings back one card of your choice that was played during a previous round.",
        execute: async (game: GameState): Promise<string> => {

        },
    },
    Spy: {
        name: "Spy",
        description: "This card plays on the enemy's side of the field, but you get two random cards from your deck.",
        execute: async (game: GameState): Promise<string> => {

        },
    },
    */
};

interface AbilityData {
    game: GameState;
    turn: GameUser;
    card: Card;
}

export interface Ability {
    name: string;
    description: string;
    execute: (data: AbilityData) => Promise<string>;
}
