import { expect } from "chai";
import rewrite from "rewire";
import { describe, it } from "mocha";
import CardManager from "../src/managers/CardManager";

describe("CardManager", () => {
    it("card value", async () => {
        const calculateValue = rewrite("../src/managers/CardManager.ts").__get__("calculateValue");
        // Check that higher rarity cards are worth more
        expect(calculateValue(2)).to.be.greaterThan(calculateValue(5));
        expect(calculateValue(7)).to.be.lessThan(calculateValue(1));
    });
    it("has cards", () => {
        // Check that we actually get any cards
        const cards = new CardManager();
        expect(cards.size).to.be.greaterThan(0);

        // Get the first card then check if it is contained in itself
        expect(cards.has(cards.first().name)).to.equal(true);

        // Check that the cards are case-insensitive
        expect(cards.has(cards.get(cards.first().name).name.toLowerCase())).to.equal(true);
    });
});
