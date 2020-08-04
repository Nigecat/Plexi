import { expect } from "chai";
import { Plexi } from "../src/Plexi";
import { describe, it } from "mocha";
import argumentTypes from "../src/commands/types";
import { User, Message, Guild, TextChannel, GuildMember } from "discord.js";

// Create mock data we can use for the testing
const mockClient = new Plexi({ plexi: { prefix: "$" } });
const mockUser = new User(mockClient, { id: "307429254017056769" });
mockClient.users.cache.set("307429254017056769", mockUser);

const mockGuild = new Guild(mockClient, { id: "621181741972979722" });
mockClient.guilds.cache.set("621181741972979722", mockGuild);
const mockMember = new GuildMember(mockClient, { id: "307429254017056769" }, mockGuild);
mockGuild.members.cache.set("307429254017056769", mockMember);
const mockChannel = new TextChannel(mockGuild, { id: "703798620738027552" });
const mockMessage = new Message(mockClient, { id: "740028702448025610", guild: mockGuild }, mockChannel);

describe("argumentTypes", () => {
    describe("string", () => {
        it("validate", () => {
            expect(argumentTypes.string.validate("abc", mockClient, mockMessage)).to.equal(true);
            expect(argumentTypes.string.validate("test", mockClient, mockMessage)).to.equal(true);
            expect(argumentTypes.string.validate("123", mockClient, mockMessage)).to.equal(true);
        });

        it("parse", () => {
            expect(argumentTypes.string.parse("abc", mockClient, mockMessage)).to.equal("abc");
            expect(argumentTypes.string.parse("test", mockClient, mockMessage)).to.equal("test");
            expect(argumentTypes.string.parse("123", mockClient, mockMessage)).to.equal("123");
        });
    });

    describe("user", () => {
        it("validate", () => {
            expect(argumentTypes.user.validate("307429254017056769", mockClient, mockMessage)).to.equal(true);
            expect(argumentTypes.user.validate("<@307429254017056769>", mockClient, mockMessage)).to.equal(true);
            expect(argumentTypes.user.validate("12345", mockClient, mockMessage)).to.equal(false);
            expect(argumentTypes.user.validate("<@12345>", mockClient, mockMessage)).to.equal(false);
        });

        it("parse", () => {
            expect(argumentTypes.user.parse("307429254017056769", mockClient, mockMessage)).to.equal(
                mockClient.users.cache.get("307429254017056769"),
            );
            expect(argumentTypes.user.parse("<@307429254017056769>", mockClient, mockMessage)).to.equal(
                mockClient.users.cache.get("307429254017056769"),
            );
        });
    });

    describe("number", () => {
        it("validate", () => {
            expect(argumentTypes.number.validate("123", mockClient, mockMessage)).to.equal(true);
            expect(argumentTypes.number.validate("abc", mockClient, mockMessage)).to.equal(false);
            expect(argumentTypes.number.validate("12.2", mockClient, mockMessage)).to.equal(true);
            expect(argumentTypes.number.validate("-4", mockClient, mockMessage)).to.equal(true);
            expect(argumentTypes.number.validate("5a", mockClient, mockMessage)).to.equal(false);
        });

        it("parse", () => {
            expect(argumentTypes.number.parse("123", mockClient, mockMessage)).to.equal(123);
            expect(argumentTypes.number.parse("2.5", mockClient, mockMessage)).to.equal(2.5);
            expect(argumentTypes.number.parse("-7", mockClient, mockMessage)).to.equal(-7);
        });
    });

    describe("member", () => {
        it("validate", () => {
            expect(argumentTypes.member.validate("307429254017056769", mockClient, mockMessage)).to.equal(true);
            expect(argumentTypes.member.validate("<@307429254017056769>", mockClient, mockMessage)).to.equal(true);
            expect(argumentTypes.member.validate("12345", mockClient, mockMessage)).to.equal(false);
            expect(argumentTypes.member.validate("<@12345>", mockClient, mockMessage)).to.equal(false);
        });

        it("parse", () => {
            expect(argumentTypes.member.parse("307429254017056769", mockClient, mockMessage)).to.equal(
                mockClient.guilds.cache.get(mockGuild.id).members.cache.get("307429254017056769"),
            );
            expect(argumentTypes.member.parse("<@307429254017056769>", mockClient, mockMessage)).to.equal(
                mockClient.guilds.cache.get(mockGuild.id).members.cache.get("307429254017056769"),
            );
        });
    });
});
