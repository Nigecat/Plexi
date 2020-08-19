import { GameState } from "../../commands/commands/Catrd/duel";

export const abilities: { [name: string]: Ability } = {
    "Morale Boost": {
        name: "Morale Boost",
        description: "Raises the power of every other card in it's row by 1.",
        execute: async (state: GameState): Promise<void> => {
            state.client.emit("debug", "test");
        },
    },
};

export interface Ability {
    name: string;
    description: string;
    execute: (state: GameState) => Promise<void>;
}
