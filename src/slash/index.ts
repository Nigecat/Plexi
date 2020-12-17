import { resolve } from "path";
import { Plexi } from "../Plexi";
import { getFiles } from "../utils/fs";
import { Collection } from "discord.js";
import { SlashCommand } from "./SlashCommand";

export default async function loadSlashCommands(client: Plexi): Promise<Collection<string, SlashCommand>> {
    // The object to hold all our commands
    const commands: Collection<string, SlashCommand> = new Collection();

    // Read all the files in the commands/ directory, we ignore any folders
    const files = await getFiles(resolve(__dirname, "commands"));
    for (let i = 0; i < files.length; i++) {
        const command: SlashCommand = new (await import(files[i].path)).default(client);
        commands.set(command.name.toLowerCase(), command);
    }

    return commands;
}
