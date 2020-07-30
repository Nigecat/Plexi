import { promises as fs } from "fs";
import { DataStore } from "./datastore";
import { resolve, extname } from "path";
import { Command, CommandArgument } from "./command";
import { Client, ClientOptions, Message } from "discord.js";

export class PlexiClient extends Client {
    public readonly owner: string;
    public readonly defaultPrefix: string;
    public readonly databasePath: string;
    public readonly commands: Record<string, Command>;
    public readonly prefixCache: Record<string, RegExp>;
    public readonly data: { prefixes: DataStore };

    constructor(options: PlexiOptions) {
        const owner = options.owner;
        const defaultPrefix = options.defaultPrefix;
        const databasePath = options.databasePath;
        delete options.owner;
        delete options.defaultPrefix;
        delete options.databasePath;
        super(options);

        this.owner = owner;
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
        // Ignore bot messages
        if (message.author.bot) return;

        // Get this server's prefix, or default to the set default prefix if it does not exist
        //  If the command was run from a dm, we use the default prefix
        const prefix = message.guild ? await this.data.prefixes.get(message.guild.id) || this.defaultPrefix : this.defaultPrefix;

        // If we don't have the prefix regex cached then we generate it
        if (!(prefix in this.prefixCache)) { 
            this.prefixCache[prefix] = new RegExp(`^(<@!?${this.user.id}>\\s+(?:\\${prefix}\\s*)?|\\${prefix}\\s*)([^\\s]+)`, "i");
            console.log(`Built command pattern for prefix "${prefix}": ${this.prefixCache[prefix]}`)
        }

        // If the message matches our prefix
        if (this.prefixCache[prefix].test(message.content)) {
            const commandName = message.content.match(this.prefixCache[prefix])[2];
            // Extract the args and remove any blank entries
            const args = message.content.replace(this.prefixCache[prefix], "").toLowerCase().trim().split(" ").filter(arg => arg);

            // If this command is registered
            if (commandName in this.commands) {
                const command = this.commands[commandName];

                // If it is an owner only command and someone tries to run it then do nothing
                if (command.ownerOnly && message.author.id !== this.owner) return;

                // If a server only command is being run in a dm
                if (command.guildOnly && !message.guild) {
                    message.channel.send("You can only run this command in a server!");
                    return
                }

                // If a dm only command is being run in a server
                if (command.dmOnly && message.guild) {
                    message.channel.send("You can only run this command in a dm!");
                    return
                }

                // If the user does not have all the permission they need (NOTE: Permissions are only checked if the command is running in a server)
                if (message.guild && !command.userPermissions.every(perm => message.member.hasPermission(perm))) {
                    message.channel.send(`You must have permission(s) \`${command.userPermissions.join(" | ")}\` to run this command!`);
                    return;
                }

                // If the client does not have all the permissions we need (NOTE: Permissions are only checked if the command is running in a server)
                if (message.guild && !command.clientPermissions.every(perm => message.guild.me.hasPermission(perm))) {
                    message.channel.send(`I need the permission(s) \`${command.userPermissions.join(" | ")}\` to run this command, please get an administrator to add them!`);
                    return;
                }

                // If the args are valid
                if (this.verifyArgs(args, command.args)) {
                    // Format the args into what the command is expecting
                    const formatted = new Map(command.args.map((arg, i) => [arg.key, args[i]]));
                    command.run(message, formatted);
                } else {
                    message.channel.send("INVALID ARGS");
                }
            }
        }
    }

    private verifyArgs(incomingArgs: string[], requiredArgs: CommandArgument[]) {
        console.log(incomingArgs, requiredArgs);
        // Skip any checks if there are no args
        if (incomingArgs.length === 0 && requiredArgs.length === 0) return true;
    }
}

export interface PlexiOptions extends ClientOptions {
    defaultPrefix: string,
    databasePath: string,
    owner: string
}   