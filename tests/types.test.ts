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
});
