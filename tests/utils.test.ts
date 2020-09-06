import { expect } from "chai";
import { describe, it } from "mocha";
import { clone } from "../src/utils/clone";
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

        describe("convertMs", () => {
            it("years", () => {
                expect(miscUtils.convertMs("1year")).to.equal(31557600000);
                expect(miscUtils.convertMs("2years")).to.equal(63115200000);
            });
            it("weeks", () => {
                expect(miscUtils.convertMs("3w")).to.equal(1814400000);
                expect(miscUtils.convertMs("1week")).to.equal(604800000);
                expect(miscUtils.convertMs("2weeks")).to.equal(1209600000);
            });
            it("days", () => {
                expect(miscUtils.convertMs("2d")).to.equal(172800000);
                expect(miscUtils.convertMs("1day")).to.equal(86400000);
                expect(miscUtils.convertMs("2days")).to.equal(172800000);
            });
            it("hours", () => {
                expect(miscUtils.convertMs("1h")).to.equal(3600000);
                expect(miscUtils.convertMs("1.5h")).to.equal(5400000);
                expect(miscUtils.convertMs("1hour")).to.equal(3600000);
                expect(miscUtils.convertMs("2hours")).to.equal(7200000);
            });
            it("minutes", () => {
                expect(miscUtils.convertMs("1m")).to.equal(60000);
                expect(miscUtils.convertMs("1minute")).to.equal(60000);
                expect(miscUtils.convertMs("2minutes")).to.equal(120000);
            });
            it("seconds", () => {
                expect(miscUtils.convertMs("1s")).to.equal(1000);
                expect(miscUtils.convertMs("1   s")).to.equal(1000);
                expect(miscUtils.convertMs("1second")).to.equal(1000);
                expect(miscUtils.convertMs("2seconds")).to.equal(2000);
            });
            it("milliseconds", () => {
                expect(miscUtils.convertMs("100")).to.equal(100);
                expect(miscUtils.convertMs("100ms")).to.equal(100);
                expect(miscUtils.convertMs(".5ms")).to.equal(0.5);
                expect(miscUtils.convertMs("1millisecond")).to.equal(1);
                expect(miscUtils.convertMs("2milliseconds")).to.equal(2);
            });
            it("negative", () => {
                expect(miscUtils.convertMs("-10.5h")).to.equal(-37800000);
                expect(miscUtils.convertMs("-.5h")).to.equal(-1800000);
                expect(miscUtils.convertMs("-100ms")).to.equal(-100);
                expect(miscUtils.convertMs("-1.5h")).to.equal(-5400000);
            });
            it("unexpected", () => {
                expect(miscUtils.convertMs("☃")).to.equal(undefined);
                expect(miscUtils.convertMs("10-.5")).to.equal(undefined);
                expect(miscUtils.convertMs("")).to.equal(undefined);
                // eslint-disable-next-line prettier/prettier
                expect(miscUtils.convertMs("00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")).to.equal(undefined);
            });
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

    describe("clone", () => {
        it("clone", () => {
            // Check if the expected object assignment behaviour works
            const y = {
                a: 1,
                b: 2,
            };
            const l = y;
            l.a = 2;
            expect(y.a).to.equal(2);

            // Test our clone function
            const a = {
                a: 1,
                b: 2,
            };
            const b = clone(a);
            b.a = 2;
            expect(a).to.not.equal(b);
        });
    });
});
