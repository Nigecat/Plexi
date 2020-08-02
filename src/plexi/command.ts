import { PlexiClient } from "./client";
import { Message, PermissionResolvable } from "discord.js";

/**
 * This class is the starting point for any command.
 * 
 * A command should extend this class and call it's constructor with the options.
 * A run function should also be created matching the function signature declared in this class. 
 * This function will be called when the command has been run.
 */
export class Command {
    /**
     * The client this command originates from
     * @type {PlexiClient}
     * @public
     */
    public client: PlexiClient;

    /**
     * The name of this command, this is what it will be called by
     * @type {string}
     * @public
     * @readonly
     * @property
     */
    public readonly name: CommandOptions["name"];

    /**
     * The description of the command, this will be displayed in the help page
     * @type {string}
     * @public
     * @readonly
     * @property
     */
    public readonly description: CommandOptions["description"];
    
    /**
     * The group this command is under, 
     *      if none is specified it will default to the name of the directory the command is in
     * @type {string}
     * @public
     * @readonly
     * @property
     */
    public group: CommandOptions["group"];

    /**
     * The permissions that the user running the command must have, 
     *      this must be a valid [PermissionResolvable]{@link https://discord.js.org/#/docs/main/stable/typedef/PermissionResolvable} object
     * @type {PermissionResolvable}
     * @public
     * @readonly
     * @property
     */
    public readonly userPermissions: CommandOptions["userPermissions"];

    /**
     * The permissions that the bot client must have, 
     *      this must be a valid [PermissionResolvable]{@link https://discord.js.org/#/docs/main/stable/typedef/PermissionResolvable} object
     * @type {PermissionResolvable}
     * @public
     * @readonly
     * @property
     */
    public readonly clientPermissions: CommandOptions["clientPermissions"];

    /**
     * Whether this command is hidden, this will prevent it from appearing on the help page
     * @type {boolean}
     * @public
     * @readonly
     * @property
     */
    public readonly hidden: CommandOptions["hidden"];

    /**
     * Whether this command can only be run by the owner,
     *      if this is enabled then the command will not display on the help page and not respond to other users
     * @type {boolean}
     * @public
     * @readonly
     * @property
     */
    public readonly ownerOnly: CommandOptions["ownerOnly"];

    /**
     * Whether this command can only be run in a guild
     * @type {boolean}
     * @public
     * @readonly
     * @property
     */
    public readonly guildOnly: CommandOptions["guildOnly"];

    /**
     * Whether this command can only be run in a dm
     * @type {boolean}
     * @public
     * @readonly
     * @property
     */
    public readonly dmOnly: CommandOptions["dmOnly"];

    /**
     * The arguments for the command, if this is not specified the command has no arguments
     * Must be a valid array of {@link CommandArgument} objects
     * @type {CommandArgument[]}
     * @public
     * @readonly
     * @property
     */
    public readonly args: CommandOptions["args"];

    constructor(client: PlexiClient, options: CommandOptions) {
        this.client = client;
        this.name = options.name;
        this.description = options.description;
        this.group = options.group;
        this.userPermissions = options.userPermissions || [];
        this.clientPermissions = options.clientPermissions || [];
        this.hidden = options.hidden || false;
        this.ownerOnly = options.ownerOnly || false;
        this.guildOnly = options.guildOnly || false;
        this.dmOnly = options.dmOnly || false;
        this.args = options.args || [];
    }

    /**
     * A function that gets run when this command is being executed, 
     *      this function should be overriden by the inherited class
     * 
     * @param {Message} message - The incoming message object
     * @param {any} args - The arguments that were specified, these are mapped by their 'key' property 
     */
    run(message: Message, args: any) {
        message.channel.send("Error: Command not implemented!");
    }
}

export interface CommandOptions {
    name: string,
    description: string,
    group?: string,
    userPermissions?: PermissionResolvable[],
    clientPermissions?: PermissionResolvable[],
    hidden?: boolean,
    ownerOnly?: boolean,
    guildOnly?: boolean,
    dmOnly?: boolean,
    args?: CommandArgument[]
}

export interface CommandArgument {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    key: string,
    validator?: (arg: any) => boolean,
    type?: "string" | "number" | "role" | "member" | "user"
    oneOf?: string[],
    infinite?: boolean,
    default?: any
    /* eslint-enable @typescript-eslint/no-explicit-any */
}