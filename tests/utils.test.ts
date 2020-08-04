import { expect } from "chai";
import { describe, it } from "mocha";
import * as miscUtils from "../src/utils/misc";

describe("utils", () => {
    describe("misc", () => {
        it("generateRegExp", () => {
            const regex = miscUtils.generateRegExp("$", "307429254017056769");
            expect(regex.test("$test")).to.equal(true);
            expect(regex.test("$")).to.equal(false);
            expect(regex.test("!test")).to.equal(false);
            expect(regex.test("!")).to.equal(false);
            expect(regex.test("307429254017056769")).to.equal(false);
            expect(regex.test("307429254017056769 test")).to.equal(false);
            expect(regex.test("<@307429254017056769>")).to.equal(false);
            expect(regex.test("<@307429254017056769> test")).to.equal(true);
            expect(regex.test("<@123456789017056769> test")).to.equal(false);
        });

        it("extractDigits", () => {
            expect(miscUtils.extractDigits("12345")).to.equal("12345");
            expect(miscUtils.extractDigits("<@307429254017056769>")).to.equal("307429254017056769");
            expect(miscUtils.extractDigits("1|2|3")).to.equal("123");
            expect(miscUtils.extractDigits("abc")).to.equal("");
        });
    });
});
