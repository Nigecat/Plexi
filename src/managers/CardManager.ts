import { resolve } from "path";
import { Collection } from "discord.js";
import basic from "../assets/cards/packs/basic.json";
import mewtal_gear from "../assets/cards/packs/mewtal-gear.json";

/** Calculate the value (in coins) of a card */
function calculateValue(rarity: number): number {
    return Math.floor((30 - rarity) ** 1.433);
}

/** An extension of the discord.js collection that allows us to have case insensitive keys */
class CaseInsensitiveCollection<T, U> extends Collection<T, U> {
    set(key: T, value: U): this {
        if (typeof key === "string") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            key = <T>(key.toLowerCase() as unknown);
        }
        return super.set(key, value);
    }
}

export default class CardManager extends CaseInsensitiveCollection<string, Card> {
    constructor() {
        super();

        basic.forEach((card) => {
            this.set(card.name, {
                name: card.name,
                pack: "Basic",
                type: card.type as Card["type"],
                power: card.power,
                value: calculateValue(card.rarity),
                rarity: card.rarity,
                image: resolve(__dirname, "..", "assets", "cards", "images", "Basic", `${card.name}.jpg`),
            });
        });

        mewtal_gear.forEach((card) => {
            this.set(card.name, {
                name: card.name,
                pack: "Mewtal Gear",
                type: card.type as Card["type"],
                power: card.power,
                value: calculateValue(card.rarity),
                rarity: card.rarity,
                image: resolve(__dirname, "..", "assets", "cards", "images", "Mewtal Gear", `${card.name}.jpg`),
            });
        });
    }
}

/** A card */
export interface Card {
    /** The name of this card */
    name: string;
    /** The pack this card belongs to */
    pack: "Basic" | "Mewtal Gear";
    /** The type of this card */
    type: "Melee" | "Scout" | "Defense";
    /** The power level of this card */
    power: number;
    /** The rarity of this card */
    rarity: number;
    /** A non-relative file path to this card's image */
    image: string;
    /** The number of coins this is card is worth */
    value: number;
}
