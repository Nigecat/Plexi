import { resolve } from "path";
import { Plexi } from "../Plexi";
import { Command } from "./Command";
import * as glob from "glob-promise";
import { Collection } from "discord.js";

export default async function loadCommands(client: Plexi): Promise<Collection<string, Command>> {
    // The object to hold all our commands
    const commands: Collection<string, Command> = new Collection();

    // Read all the files in the commands/ directory, we ignore any folders
    const files = await glob(resolve(__dirname, "commands", "**", "*", "*.js"));
    for (let i = 0; i < files.length; i++) {
        const command = new (await import(files[i])).default(client);
        if (command.validate) {
            commands.set(command.name, command);
        }
    }

    return commands;
}
