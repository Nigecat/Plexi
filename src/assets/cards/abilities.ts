import { GameState, GameUser } from "../../commands/commands/Catrd/duel";
import { Card } from "../../managers/CardManager";

export const abilities: { [name: string]: Ability } = {
    "Morale Boost": {
        name: "Morale Boost",
        description: "Raises the power of every other card in it's row by 1.",
        execute: async ({ turn, card }: { turn: GameUser; card: Card }): Promise<void> => {
            turn.playedCards
                .filter((c) => c.type === card.type)
                .forEach((card) => {
                    card.power += 1;
                });
        },
    },
    /*
    Medic: {
        name: "Medic",
        description: "Brings back one card of your choice that was played during a previous round.",
        execute: async (game: GameState): Promise<void> => {

        },
    },
    "Tight Bond": {
        name: "Tight Bond",
        description: "Doubles its power each time you play the same card.",
        execute: async (game: GameState): Promise<void> => {

        },
    },
    Spy: {
        name: "Spy",
        description: "This card plays on the enemy's side of the field, but you get two random cards from your deck.",
        execute: async (game: GameState): Promise<void> => {

        },
    },
    */
};

export interface Ability {
    name: string;
    description: string;
    execute: (data: { game: GameState; turn: GameUser; card: Card }) => Promise<void>;
}
