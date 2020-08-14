import { resolve } from "path";
import { Collection } from "discord.js";
import basic from "../assets/cards/packs/basic.json";
import mewtal_gear from "../assets/cards/packs/mewtal-gear.json";

export default class CardManager extends Collection<string, Card> {
    constructor() {
        super();

        basic.forEach((card) => {
            this.set(card.name, {
                name: card.name,
                pack: "Basic",
                type: card.type as Card["type"],
                power: card.power,
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
}
