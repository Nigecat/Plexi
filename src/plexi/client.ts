import { promises as fs } from "fs";
import { DataStore } from "./datastore";
import { resolve, extname } from "path";
import { Command, CommandArgument } from "./command";
import { Client, ClientOptions, Message } from "discord.js";

/**
 * The main client, the bot should start here.
 * @class
 * @extends Client
 */
export class PlexiClient extends Client {
    /**
     * The owner of the bot
     * @type {string}
     * @public
     * @readonly
     * @property
     */
    public readonly owner: string;

    /**
     * The default prefix the bot will respond to, this is used whenever a guild does not have a custom prefix set.
     * @type {string}
     * @public
     * @readonly
     * @property
     */
    public readonly defaultPrefix: string;

    /**
     * The path of the database, this is where all persistent data will be stored.
     * @type {string}
     * @public
     * @readonly
     * @property
     */
    public readonly databasePath: string;

    /**
     * A map containing all registered commands, when attempting to execute a command the bot will search for it in here.
     * This will remain empty until {@link registerCommands} has been run.
     * @type {Record<string, Command>}
     * @public
     * @readonly
     * @property
     */
    public readonly commands: Record<string, Command>;

    /**
     * A cache containing regular expressions mapped by prefixes, this allowed us to more easily respond to a mention of the bot (and to improve speed).
     * This cache is automatically filled as the bot recieves messages.
     * @type {Record<string, RegExp>}
     * @public
     * @readonly
     * @property
     */
    public readonly prefixCache: Record<string, RegExp>;

    /**
     * An object containing any persistent data the client needs to access.
     * @type {object}
     * @public
     * @readonly
     * @property
     */
    public readonly data: { prefixes: DataStore };

    /**
     * Create a client
     * @param {PlexiOptions} options - The options for the client 
     * @constructor
     */
    constructor(options: PlexiOptions) {
        // We have to call super() before we can access 'this' but we can't pass our extra data to the other constructor,
        //      So we have to create a variable for each one and remove it from the original options object
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

        // Init our data storage
        this.data = { prefixes: new DataStore(this.databasePath, "prefix") };
        this.data.prefixes.connect();

        // Assign our on message handler
        this.on("message", this.onMessage);
    }

    /**
     * Register a directory of commands to the client
     * 
     * Inside the specified folder, the function is expecting there to be subfolders for command groups.
     * Inside each group directory, each file should default export a class extending the {@link Command} class.
     * If the super() call of it specifies the {@link Command#group} property then that will override the directory it is in.
     * This function also connects to the database so it must be run before attempting to login the bot.
     * @param {string} - The directory the commands are contained in
     * @function
     */
    async registerCommands(dir: string) {
        // Loop through each group
        for (const group of await fs.readdir(dir)) {
            // Loop through each file contained in the group
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

    /**
     * The message handler, this is fired whenever we recieve an incoming message
     * @param {Message} message - The incoming message
     * @private
     * @function
     */
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
                if (this.verifyArgs(message, args, command.args)) {
                    // Format the args into what the command is expecting
                    const formatted = new Map(command.args.map((arg, i) => [arg.key, args[i]]));
                    command.run(message, formatted);
                } else {
                    message.channel.send("INVALID ARGS");
                }
            }
        }
    }

    /**
     * Check if a set of arguments match the expected arguments.
     * @param {Message} message - The corrosponding message object
     * @param {string[]} incomingArgs - The incoming args
     * @param {CommandArgument[]} requiredArgs - The args that the incoming args should match
     * @function
     * @private
     * @returns Whether or not they match
     */
    private verifyArgs(message: Message, incomingArgs: string[], requiredArgs: CommandArgument[]) {
        // Skip any checks if there are no args
        if (incomingArgs.length === 0 && requiredArgs.length === 0) return true;

        // If we have any infinite args
        if (requiredArgs.some(arg => arg.infinite)) {
            throw new Error("Infinite args not supported yet!");
        }

        else {
            // If we do not have the matching number of arguments then exit
            if (incomingArgs.length !== requiredArgs.length) return false;

            // Loop through each argument so we can verify them seperately
            for (let i = 0; i < incomingArgs.length; i++) {
                // If the one of property is there we check that first and can short circuit the rest of the checks
                if (requiredArgs[i].oneOf) return requiredArgs[i].oneOf.includes(incomingArgs[i]);

                // If there are anything other than digits in the argument
                if (requiredArgs[i].type === "number" && !/^\d+$/.test(incomingArgs[i])) return false;

                // Otherwise if it is not a string, then it must be a mention
                else if (requiredArgs[i].type !== "string") {
                    // Extract the mention id
                    const id = incomingArgs[i].match(/^<@!?(\d+)>$/)[0];

                    switch (requiredArgs[i].type) {
                        case "role": {
                            if (!message.guild.roles.cache.has(id)) return false;
                            break;
                        }

                        case "channel": {
                            if (!message.guild.channels.cache.has(id)) return false;
                            break;
                        }

                        case "member": {
                            if (!message.guild.members.cache.has(id)) return false;
                            break;
                        }

                        case "user": {
                            if (!this.users.cache.has(id)) return false;
                            break;
                        }

                        case "text-channel": {
                            if (!message.guild.channels.cache.filter(channel => channel.type === "text").has(id)) return false;
                            break;
                        }

                        case "voice-channel": {
                            if (!message.guild.channels.cache.filter(channel => channel.type === "voice").has(id)) return false;
                            break;
                        }

                        // The string type can be anything
                        case "string": {
                            break;
                        }
                    }
                }

                // Now we know that it is the right format, we then run the validator on it if it has one
                if (requiredArgs[i].validator && !requiredArgs[i].validator(incomingArgs[i])) return false;


                /*   If we get this far then the argument *should* be valid   */
            }
        }
    }
}

/** 
 * An extended version of the discord.js [ClientOptions]{@link https://discord.js.org/#/docs/main/stable/typedef/ClientOptions} object.
 * @typedef {object} PlexiOptions
 * @property {string} defaultPrefix - The default prefix for the bot
 * @property {string} databasePath - The path of the database to store data in
 * @property {string} owner - The [Snowflake]{@link https://discord.js.org/#/docs/main/stable/typedef/Snowflake} of the bot owner
 * 
*/
export interface PlexiOptions extends ClientOptions {
    defaultPrefix: string,
    databasePath: string,
    owner: string
}   