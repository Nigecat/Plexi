import { expect } from "chai";
import { Plexi } from "../src/Plexi";
import { describe, it } from "mocha";
import argumentTypes from "../src/commands/types";
import { User, Message, Guild, TextChannel, GuildMember, Role } from "discord.js";

// Create mock data we can use for the testing
const mockClient = new Plexi({ plexi: { prefix: "$" } });
const mockGuild = new Guild(mockClient, { id: "621181741972979722" });
const mockRole = new Role(mockClient, { id: "703164955763146754" }, mockGuild);

// For some reason we can't assign a tag in the User object constructor
// And since the .tag property is readonly we have to redefine it so we can add our own tag
const mockUser = new User(mockClient, { id: "307429254017056769" });
Object.defineProperty(mockUser, "tag", {
    value: "Nigecat#2288",
    writable: true,
    enumerable: true,
});

const mockChannel = new TextChannel(mockGuild, { id: "703798620738027552" });
const mockMessage = new Message(mockClient, { id: "740028702448025610", guild: mockGuild }, mockChannel);

// We also can't assign a tag in the GuildMember object constructor (and it doesn't get the one from the other user object)
const mockMember = new GuildMember(mockClient, { id: "307429254017056769", user: mockUser }, mockGuild);
Object.defineProperty(mockMember.user, "tag", {
    value: "Nigecat#2288",
    writable: true,
    enumerable: true,
});

mockClient.users.cache.set("307429254017056769", mockUser);
mockClient.guilds.cache.set("621181741972979722", mockGuild);
mockGuild.roles.cache.set("703164955763146754", mockRole);
mockGuild.members.cache.set("307429254017056769", mockMember);

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
            expect(argumentTypes.user.validate("Nigecat#2288", mockClient, mockMessage)).to.equal(true);
            expect(argumentTypes.user.validate("Nigecat#0115", mockClient, mockMessage)).to.equal(false);
        });

        it("parse", () => {
            expect(argumentTypes.user.parse("307429254017056769", mockClient, mockMessage)).to.equal(
                mockClient.users.cache.get("307429254017056769"),
            );
            expect(argumentTypes.user.parse("<@307429254017056769>", mockClient, mockMessage)).to.equal(
                mockClient.users.cache.get("307429254017056769"),
            );
            expect(argumentTypes.user.parse("Nigecat#2288", mockClient, mockMessage)).to.equal(
                mockClient.users.cache.get("307429254017056769"),
            );
        });
    });

    describe("boolean", () => {
        it("validate", () => {
            expect(argumentTypes.boolean.validate("true", mockClient, mockMessage)).to.equal(true);
            expect(argumentTypes.boolean.validate("false", mockClient, mockMessage)).to.equal(true);
            expect(argumentTypes.boolean.validate("yes", mockClient, mockMessage)).to.equal(true);
            expect(argumentTypes.boolean.validate("no", mockClient, mockMessage)).to.equal(true);
        });

        it("parse", () => {
            expect(argumentTypes.boolean.parse("true", mockClient, mockMessage)).to.equal(true);
            expect(argumentTypes.boolean.parse("false", mockClient, mockMessage)).to.equal(false);
            expect(argumentTypes.boolean.parse("yes", mockClient, mockMessage)).to.equal(true);
            expect(argumentTypes.boolean.parse("no", mockClient, mockMessage)).to.equal(false);
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
            expect(argumentTypes.number.parse("-7", mockClient, mockMessage)).to.equal(0);
        });
    });

    describe("member", () => {
        it("validate", () => {
            expect(argumentTypes.member.validate("307429254017056769", mockClient, mockMessage)).to.equal(true);
            expect(argumentTypes.member.validate("<@307429254017056769>", mockClient, mockMessage)).to.equal(true);
            expect(argumentTypes.member.validate("12345", mockClient, mockMessage)).to.equal(false);
            expect(argumentTypes.member.validate("<@12345>", mockClient, mockMessage)).to.equal(false);
            expect(argumentTypes.member.validate("Nigecat#2288", mockClient, mockMessage)).to.equal(true);
            expect(argumentTypes.member.validate("Nigecat#0115", mockClient, mockMessage)).to.equal(false);
        });

        it("parse", () => {
            expect(argumentTypes.member.parse("307429254017056769", mockClient, mockMessage)).to.equal(
                mockClient.guilds.cache.get(mockGuild.id).members.cache.get("307429254017056769"),
            );
            expect(argumentTypes.member.parse("<@307429254017056769>", mockClient, mockMessage)).to.equal(
                mockClient.guilds.cache.get(mockGuild.id).members.cache.get("307429254017056769"),
            );
            expect(argumentTypes.member.parse("Nigecat#2288", mockClient, mockMessage)).to.equal(
                mockClient.guilds.cache.get(mockGuild.id).members.cache.get("307429254017056769"),
            );
        });
    });

    describe("role", () => {
        it("validate", () => {
            expect(argumentTypes.role.validate("703164955763146754", mockClient, mockMessage)).to.equal(true);
            expect(argumentTypes.role.validate("<@703164955763146754>", mockClient, mockMessage)).to.equal(true);
            expect(argumentTypes.role.validate("12345", mockClient, mockMessage)).to.equal(false);
            expect(argumentTypes.role.validate("<@12345>", mockClient, mockMessage)).to.equal(false);
        });

        it("parse", () => {
            expect(argumentTypes.role.parse("703164955763146754", mockClient, mockMessage)).to.equal(
                mockClient.guilds.cache.get(mockGuild.id).roles.cache.get("703164955763146754"),
            );
            expect(argumentTypes.role.parse("<@703164955763146754>", mockClient, mockMessage)).to.equal(
                mockClient.guilds.cache.get(mockGuild.id).roles.cache.get("703164955763146754"),
            );
        });
    });
});

mockClient.destroy();
