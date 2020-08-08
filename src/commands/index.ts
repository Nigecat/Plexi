import { Plexi } from "../Plexi";
import { Command } from "./Command";
import { promises as fs } from "fs";
import { Collection } from "discord.js";
import { resolve, extname } from "path";

async function getFiles(path: string) {
    const entries = await fs.readdir(path, { withFileTypes: true });

    // Get files within the current directory and add a path key to the file objects
    const files = entries
        .filter((file) => !file.isDirectory() && extname(file.name).toLowerCase() === ".js")
        .map((file) => ({ ...file, path: resolve(path, file.name) }));

    // Get folders within the current directory
    const folders = entries.filter((folder) => folder.isDirectory());

    // Add the found files within the subdirectory to the files array by calling this function
    for (const folder of folders) files.push(...(await getFiles(resolve(path, folder.name))));

    return files;
}

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
