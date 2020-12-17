import { resolve } from "path";
import loadCommands from "./src/commands";
import { stripIndents } from "common-tags";
import { existsSync, promises as fs } from "fs";

/** Copy `CHANGELOG.md` to `docs/changelog.markdown` */
async function changelog(): Promise<void> {
    const file = resolve(__dirname, "docs", "changelog.markdown");

    // First we delete the output file if it exists
    if (existsSync(file)) await fs.unlink(file);

    let data = await fs.readFile("CHANGELOG.md", "utf-8");
    data = stripIndents`
        ---
        layout: page
        title: Changelog
        permalink: /changelog
        ---

        ${data}
    `;

    await fs.writeFile(file, data, "utf-8");
}

/**
 * This file will read all commands in `src/commands/commands` and parse the expected markdown into `docs/commands.markdown`.
 * This will overwrite any data in `docs/commands.markdown`.
 * It will also copy `CHANGELOG.md` to `docs/changelog.markdown`.
 */
async function main(): Promise<void> {
    await changelog();

    const file = resolve(__dirname, "docs", "commands.markdown");

    // First we delete the output file if it exists
    if (existsSync(file)) await fs.unlink(file);

    // Load our commands
    const commands = (await loadCommands(undefined))
        // Remove any hidden commands
        .filter((command) => !command.options.hidden)
        // Convert the commands from a collection to an array (this allows us to call .findIndex on it)
        .array()
        // Remove any duplicate command names (this is since aliases register as a seperate command, but still have the same name internally)
        .filter((command, index, found) => found.findIndex((cmd) => cmd.name === command.name) === index);

    // Sort the commands by group
    commands.sort((first, second) => first.options.group.localeCompare(second.options.group));

    let data = stripIndents`
        ---
        layout: page
        title: Commands
        permalink: /commands
        ---

        ## Notes for reading:
        - [user] - A discord user, this can be either a mention or the id of a user.
        - [member] - A discord member, this can be either a mention or the id of a user **in the same server as where you are running this command**
        - [arg...] - The argument can have an infinite length. Any other arguments are restricted to a single word.
        - [arg1 \\| arg2] - The supplied argument must be one of these.

    `;
    commands.forEach((command, i) => {
        // Check if this is a new command group (since they are sorted by group we can just compare to the last one)
        if (i === 0 || commands[i - 1].options.group !== commands[i].options.group) {
            // If it is create a new table
            data += `\n\n### ${command.options.group}\n\n| Command | Description | Usage |\n| ------- | :---------: | ----- |\n`;
        } else {
            // Otherwise just append a table row (and escape the '|' character from the format string)
            data += `| ${command.name} | ${command.options.description} | $${command.name} ${command.format.replace(
                /\|/g,
                "\\|",
            )} |\n`;
        }
    });

    await fs.writeFile(file, data, "utf-8");
}

main();
