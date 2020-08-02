import { expect } from "chai";
import { describe, it } from "mocha";
import { ARGUMENT_TYPES } from "../src/plexi/argumentVerifier";

describe("argumentVerifier", () => {
    describe("number", () => {
        it("verifier", () => {
            expect(ARGUMENT_TYPES.number.check("5")).equal(true);
            expect(ARGUMENT_TYPES.number.check("34")).equal(true);
            expect(ARGUMENT_TYPES.number.check("5935934859435734852435832932984293423498")).equal(true);
            expect(ARGUMENT_TYPES.number.check("123")).equal(true);
            expect(ARGUMENT_TYPES.number.check("12")).equal(true);
            expect(ARGUMENT_TYPES.number.check("cat")).equal(false);
        });

        it("parser", () => {
            expect(ARGUMENT_TYPES.number.format("67")).equal("67");
            expect(ARGUMENT_TYPES.number.format("dog")).equal("dog");
        });
    });
});