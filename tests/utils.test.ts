import { expect } from "chai";
import { describe, it } from "mocha";
import * as miscUtils from "../src/utils/misc";
import * as imageUtils from "../src/utils/image";

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

    describe("image", () => {
        it("isDiscordURL", () => {
            expect(imageUtils.isDiscordURL("https://youtu.be/dQw4w9WgXcQ")).to.equal(false);
            expect(
                imageUtils.isDiscordURL(
                    "https://cdn.discordapp.com/attachments/587782757824987141/740066051995205752/unknown.png",
                ),
            ).to.equal(true);
            expect(
                imageUtils.isDiscordURL(
                    "https://cdn.discordapp.com/icons/621181741972979722/e5df605f2c61b94b894b6fc963d7ac45.png?size=512",
                ),
            ).to.equal(true);
            expect(
                imageUtils.isDiscordURL(
                    "https://cdn.discordapp.com/attachments/709636050586173503/740066259512852510/spongebob_mocking.png",
                ),
            ).to.equal(true);
        });
    });
});
