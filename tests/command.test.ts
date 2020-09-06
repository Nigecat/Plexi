import { expect } from "chai";
import { describe, it } from "mocha";
import { Command } from "../src/commands/Command";

// Since the command class is an abstract class we have to extend it for our testing
class TestCommand extends Command {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    run() {}
}

describe("command", () => {
    describe("flags", () => {
        // Create a command for testing the flag setting
        const command = new TestCommand(null, {
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
            args: [],
            hidden: false,
        });
        // Check the defaults as well
        const defaultCommand = new TestCommand(null, {
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
            expect(command.options.args).to.eql([]);
            expect(defaultCommand.options.args).to.eql([]);
        });
        it("hidden", () => {
            expect(command.options.hidden).to.equal(false);
            expect(defaultCommand.options.hidden).to.equal(false);
        });
    });
});
