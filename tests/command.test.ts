import { expect } from "chai";
import { describe, it } from "mocha";
import { Message } from "discord.js";
import { Command, CommandInfo } from "../src/commands/Command";

// Since the command class is an abstract class we have to extend it for our testing
class TestCommand extends Command {
    constructor(options: Partial<CommandInfo>, client = null) {
        options.name = options.name || "test";
        options.group = options.group || "Test";
        super(client, options as CommandInfo);
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    run() {}
}

describe("command", () => {
    describe("flags", () => {
        // Create a command for testing the flag setting
        const command = new TestCommand({
            name: "test",
            group: "Test",
            description: "A test command",
            details: "A command we are using for testing",
            aliases: ["test2"],
            guildOnly: false,
            dmOnly: false,
            clientPermissions: [],
            userPermissions: [],
            nsfw: false,
            args: [
                { name: "test1", type: "string" },
                { name: "test2", type: "string" },
            ],
            hidden: false,
            ownerOwnly: false,
        });
        // Check the defaults as well
        const defaultCommand = new TestCommand({
            name: "test",
            group: "Test",
        });

        // Verify all the flags set properly on the commands
        it("name", () => {
            expect(command.name).to.equal("test");
        });
        it("group", () => {
            expect(command.options.group).to.equal("Test");
        });
        it("description", () => {
            expect(command.options.description).to.equal("A test command");
            expect(defaultCommand.options.description).to.equal("");
        });
        it("details", () => {
            expect(command.options.details).to.equal("A command we are using for testing");
            expect(defaultCommand.options.details).to.equal("");
        });
        it("aliases", () => {
            expect(command.options.aliases).to.eql(["test2"]);
            expect(defaultCommand.options.aliases).to.eql([]);
        });
        it("guildOnly", () => {
            expect(command.options.guildOnly).to.equal(false);
            expect(defaultCommand.options.guildOnly).to.equal(false);
        });
        it("dmOnly", () => {
            expect(command.options.dmOnly).to.equal(false);
            expect(defaultCommand.options.dmOnly).to.equal(false);
        });
        it("ownerOwnly", () => {
            expect(command.options.ownerOwnly).to.equal(false);
            expect(defaultCommand.options.ownerOwnly).to.equal(false);
        });
        it("clientPermissions", () => {
            expect(command.options.clientPermissions).to.eql([]);
            expect(defaultCommand.options.clientPermissions).to.eql([]);
        });
        it("userPermissions", () => {
            expect(command.options.userPermissions).to.eql([]);
            expect(defaultCommand.options.userPermissions).to.eql([]);
        });
        it("nsfw", () => {
            expect(command.options.nsfw).to.equal(false);
            expect(defaultCommand.options.nsfw).to.equal(false);
        });
        it("args", () => {
            expect(command.options.args).to.eql([
                { name: "test1", type: "string" },
                { name: "test2", type: "string" },
            ]);
            expect(defaultCommand.options.args).to.eql([]);
        });
        it("hidden", () => {
            expect(command.options.hidden).to.equal(false);
            expect(defaultCommand.options.hidden).to.equal(false);
        });
    });

    // Test the checker for whether or not we can run
    describe("canRun", () => {
        it("dmOnly", () => {
            const command = new TestCommand({ dmOnly: true });
            expect(command.canRun({ channel: { type: "text" } } as Message))
                .property("canRun")
                .to.equal(false);
            expect(command.canRun({ channel: { type: "dm" } } as Message))
                .property("canRun")
                .to.equal(true);
        });
        it("guildOnly", () => {
            const command = new TestCommand({ guildOnly: true });
            expect(command.canRun({ guild: null } as Message))
                .property("canRun")
                .to.equal(false);
            expect(command.canRun(({ guild: true } as unknown) as Message))
                .property("canRun")
                .to.equal(true);
        });
        it("ownerOnly", () => {
            const command = new TestCommand({ ownerOwnly: true }, { config: { owner: "12345" } });
            expect(command.canRun({ author: { id: "54321" } } as Message))
                .property("canRun")
                .to.equal(false);
            expect(command.canRun({ author: { id: "12345" } } as Message))
                .property("canRun")
                .to.equal(true);
        });
        it("clientPermissions", () => {
            const command = new TestCommand({ clientPermissions: ["ADD_REACTIONS"] });
            // eslint-disable-next-line prettier/prettier
            expect(command.canRun((({ guild: { me: { hasPermission: () => false } } } as unknown) as Message)))
                .property("canRun")
                .to.equal(false);
        });
        it("userPermissions", () => {
            const command = new TestCommand({ userPermissions: ["ADD_REACTIONS"] });
            expect(command.canRun(({ guild: true, member: { hasPermission: () => false } } as unknown) as Message))
                .property("canRun")
                .to.equal(false);
            // The permission check is meant to be skipped if we don't have a valid guild object
            // Since then we are likely in a dm
            expect(command.canRun(({ member: { hasPermission: () => false } } as unknown) as Message))
                .property("canRun")
                .to.equal(true);
        });
        it("nsfw", () => {
            const command = new TestCommand({ nsfw: true });
            expect(command.canRun({ channel: { nsfw: false } } as Message))
                .property("canRun")
                .to.equal(false);
            expect(command.canRun(({ channel: { nsfw: false, type: "dm" } } as unknown) as Message))
                .property("canRun")
                .to.equal(true);
            expect(command.canRun({ channel: { nsfw: true } } as Message))
                .property("canRun")
                .to.equal(true);
        });
        it("whitelist", () => {
            const command = new TestCommand({ whitelist: ["12345"] });
            expect(command.canRun({ author: { id: "54321" } } as Message))
                .property("canRun")
                .to.equal(false);
            expect(command.canRun({ author: { id: "12345" } } as Message))
                .property("canRun")
                .to.equal(true);
        });
        it("blacklist", () => {
            const command = new TestCommand({ blacklist: ["12345"] });
            expect(command.canRun({ author: { id: "54321" } } as Message))
                .property("canRun")
                .to.equal(true);
            expect(command.canRun({ author: { id: "12345" } } as Message))
                .property("canRun")
                .to.equal(false);
        });
    });

    // Check the argument validator
    describe("validateArgs", () => {
        it("oneOf", () => {
            const command = new TestCommand({
                args: [
                    {
                        name: "test",
                        type: "string",
                        oneOf: ["a", "b"],
                    },
                ],
            });
            expect(command.validateArgs(["test"], null))
                .property("isValid")
                .to.equal(false);
            expect(command.validateArgs(["a"], null))
                .property("isValid")
                .to.equal(true);
        });
        it("default", () => {
            const command = new TestCommand({
                args: [
                    {
                        name: "test",
                        type: "string",
                        default: "a",
                    },
                ],
            });
            expect(command.validateArgs(["test"], null))
                .property("isValid")
                .to.equal(true);
            expect(command.validateArgs([], null)).property("isValid").to.equal(true);
            expect(command.validateArgs([], null)).property("formattedArgs").to.eql(["a"]);
        });
        it("length", () => {
            const command = new TestCommand({ args: [{ name: "test", type: "string" }] });
            expect(command.validateArgs([], null)).property("isValid").to.equal(false);
        });
        it("infinite", () => {
            const command = new TestCommand({ args: [{ name: "test", type: "string", infinite: true }] });
            expect(command.validateArgs([], null)).property("isValid").to.equal(false);
            expect(command.validateArgs(["infinite", "test"], null))
                .property("isValid")
                .to.equal(true);
            expect(command.validateArgs(["infinite", "test"], null))
                .property("formattedArgs")
                .to.eql(["infinite test"]);
        });
        it("validator", () => {
            const command = new TestCommand({ args: [{ name: "test", type: "string", validate: (s) => s === "a" }] });
            expect(command.validateArgs(["test"], null))
                .property("isValid")
                .to.equal(false);
            expect(command.validateArgs(["a"], null))
                .property("isValid")
                .to.equal(true);
        });
        it("type", () => {
            const command = new TestCommand({ args: [{ name: "test", type: "number" }] });
            expect(command.validateArgs(["1"], null))
                .property("isValid")
                .to.equal(true);
            expect(command.validateArgs(["a"], null))
                .property("isValid")
                .to.equal(false);
            expect(command.validateArgs(["1"], null))
                .property("formattedArgs")
                .to.eql([1]);
        });
    });
});
