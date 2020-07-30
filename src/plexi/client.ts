import { promises as fs } from "fs";
import { Command } from "./command";
import { resolve, extname } from "path";
import { Client, ClientOptions, Message } from "discord.js";

export class PlexiClient extends Client {
    /* eslint-disable @typescript-eslint/ban-types */
    public readonly defaultPrefix: string;
    public readonly commands: {(name: string): Command}[] | {};
    public readonly prefixCache: {(id: string): RegExp}[] | {};
    /* eslint-enable @typescript-eslint/ban-types */

    constructor(options: PlexiOptions) {
        const defaultPrefix = options.defaultPrefix;
        delete options.defaultPrefix;
        super(options);

        this.defaultPrefix = defaultPrefix;
        this.commands = {};
        this.prefixCache = {};

        this.on("message", this.onMessage);
    }

    async registerCommands(dir: string) {
        for (const group of await fs.readdir(dir)) {
            for (const file of await fs.readdir(resolve(dir, group))) {
                // Ignore any non javascript files
                if (extname(file).toLowerCase() !== ".js") continue;

                // Import the command and create a new instance of it
                const command: Command = new (await import(resolve(dir, group, file))).default(this);
                
                // Assume the command group based off the parent folder if we aren't explicitly told
                command.group = command.group || group;

                console.log(`Registered command ${command.group}:${command.name}`);

                this.commands[command.name] = command;
            }
        }
    }

    onMessage(message: Message) {
        console.log(message);
    }
}

export interface PlexiOptions extends ClientOptions {
    defaultPrefix: string
}   