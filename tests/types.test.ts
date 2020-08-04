import { expect } from "chai";
import { User } from "discord.js";
import { Plexi } from "../src/Plexi";
import { describe, it } from "mocha";
import argumentTypes from "../src/commands/types";

const mockClient = new Plexi({ plexi: { prefix: "$" } });
mockClient.users.cache.set("307429254017056769", new User(mockClient, { id: "307429254017056769" }));

describe("argumentTypes", () => {
    describe("string", () => {
        it("validate", () => {
            expect(argumentTypes.string.validate("abc", mockClient)).to.equal(true);
            expect(argumentTypes.string.validate("test", mockClient)).to.equal(true);
            expect(argumentTypes.string.validate("123", mockClient)).to.equal(true);
        });

        it("parse", () => {
            expect(argumentTypes.string.parse("abc", mockClient)).to.equal("abc");
            expect(argumentTypes.string.parse("test", mockClient)).to.equal("test");
            expect(argumentTypes.string.parse("123", mockClient)).to.equal("123");
        });
    });

    describe("user", () => {
        it("validate", () => {
            expect(argumentTypes.user.validate("307429254017056769", mockClient)).to.equal(true);
            expect(argumentTypes.user.validate("<@307429254017056769>", mockClient)).to.equal(true);
            expect(argumentTypes.user.validate("12345", mockClient)).to.equal(false);
            expect(argumentTypes.user.validate("<@12345>", mockClient)).to.equal(false);
        });

        it("parse", () => {
            expect(argumentTypes.user.parse("307429254017056769", mockClient)).to.equal(
                mockClient.users.cache.get("307429254017056769"),
            );
            expect(argumentTypes.user.parse("<@307429254017056769>", mockClient)).to.equal(
                mockClient.users.cache.get("307429254017056769"),
            );
        });
    });

    describe("number", () => {
        it("validate", () => {
            expect(argumentTypes.number.validate("123", mockClient)).to.equal(true);
            expect(argumentTypes.number.validate("abc", mockClient)).to.equal(false);
            expect(argumentTypes.number.validate("12.2", mockClient)).to.equal(true);
            expect(argumentTypes.number.validate("-4", mockClient)).to.equal(true);
            expect(argumentTypes.number.validate("5a", mockClient)).to.equal(false);
        });

        it("parse", () => {
            expect(argumentTypes.number.parse("123", mockClient)).to.equal(123);
            expect(argumentTypes.number.parse("2.5", mockClient)).to.equal(2.5);
            expect(argumentTypes.number.parse("-7", mockClient)).to.equal(-7);
        });
    });
});
