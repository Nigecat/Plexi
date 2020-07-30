import { promises as fs } from "fs";
import { Command } from "./command";
import { DataStore } from "./datastore";
import { resolve, extname } from "path";
import { Client, ClientOptions, Message } from "discord.js";

export class PlexiClient extends Client {
    public readonly defaultPrefix: string;
    public readonly databasePath: string;
    public readonly commands: {(name: string): Command}[] | {};
    public readonly prefixCache: {(id: string): RegExp}[] | {};
    public readonly data: { prefixes: DataStore };

    constructor(options: PlexiOptions) {
        const defaultPrefix = options.defaultPrefix;
        const databasePath = options.databasePath;
        delete options.defaultPrefix;
        delete options.databasePath;
        super(options);

        this.defaultPrefix = defaultPrefix;
        this.databasePath = databasePath;
        this.commands = {};
        this.prefixCache = {};
        this.data = { prefixes: new DataStore(this.databasePath, "prefix") };

        this.on("message", this.onMessage);
    }

    async registerCommands(dir: string) {
        await this.data.prefixes.connect();

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

    async onMessage(message: Message) {
        // Get this server's prefix, or default to the set default prefix if it does not exist
        const prefix = await this.data.prefixes.get(message.guild.id) || this.defaultPrefix;

        // If we don't have the prefix regex cached then we generate it
        if (!(prefix in this.prefixCache)) { 
            this.prefixCache[prefix] = new RegExp(`^(<@!?${this.user.id}>\\s+(?:\\${prefix}\\s*)?|\\${prefix}\\s*)([^\\s]+)`, "i");
            console.log(`Built command pattern for prefix "${prefix}": ${this.prefixCache[prefix]}`)
        }

        // If the message matches our prefix
        if (this.prefixCache[prefix].test(message.content)) {
            console.log(message.content);
        }
    }
}

export interface PlexiOptions extends ClientOptions {
    defaultPrefix: string,
    databasePath: string
}   