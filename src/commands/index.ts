import { resolve } from "path";
import { Plexi } from "../Plexi";
import { Command } from "./Command";
import { getFiles } from "../utils/fs";
import { Collection } from "discord.js";

export default async function loadCommands(client: Plexi): Promise<Collection<string, Command>> {
    // The object to hold all our commands
    const commands: Collection<string, Command> = new Collection();

    // Read all the files in the commands/ directory, we ignore any folders
    const files = await getFiles(resolve(__dirname, "commands"));
    for (let i = 0; i < files.length; i++) {
        const command: Command = new (await import(files[i].path)).default(client);
        commands.set(command.name.toLowerCase(), command);
        // Set any aliases
        command.options.aliases.forEach((alias) => commands.set(alias.toLowerCase(), command));
    }

    return commands;
}
