import { expect } from "chai";
import { describe, it } from "mocha";
import * as miscUtils from "../src/utils/misc";

describe("utils/misc", () => {
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
});
