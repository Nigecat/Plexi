import { Plexi } from "../Plexi";
import { PermissionResolvable, Message } from "discord.js";

/** A command that can be run in a client */
export class Command {
    /** The name of this command */
    public readonly name: string;

    constructor(public readonly client: Plexi, public readonly options: CommandInfo) {
        this.name = options.name;

        // Set the defaults
        this.options.description = this.options.description ?? "";
        this.options.details = this.options.details ?? "";
        this.options.guildOnly = this.options.guildOnly ?? false;
        this.options.ownerOwnly = this.options.ownerOwnly ?? false;
        this.options.clientPermissions = this.options.clientPermissions ?? [];
        this.options.userPermissions = this.options.userPermissions ?? [];
        this.options.nsfw = this.options.nsfw ?? false;
        this.options.args = this.options.args ?? [];
        this.options.hidden = this.options.hidden ?? false;
    }

    /** The function to run this command, this should be overridden by the inherited class
     * @param {Message} message - The incoming message object
     * @param {string[]} args - The incoming arguments, this will be an array matching the specified {@link Argument} array
     * (each element will be automatically converted to the specified type prior to calling the run function).
     * @abstract
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    run(message: Message, args: string[]): void {
        throw new Error("Command not implemented! Create a run() function in the inherited class.");
    }
}

export interface CommandInfo {
    /** The name of the command */
    name: string;
    /** The name of the group this command belongs to */
    group: string;
    /** A short description of this command */
    description?: string;
    /** A long description of this command */
    details?: string;
    /** [guildOnly=false] Whether or not this command should only function in a guild channel */
    guildOnly?: boolean;
    /** [ownerOwnly=false] Whether or not the command is usable only by an owner */
    ownerOwnly?: boolean;
    /** Permissions required by the client to use the command (Must be a valid [PermissionResolvable]{@link https://discord.js.org/#/docs/main/stable/typedef/PermissionResolvable} array) */
    clientPermissions?: PermissionResolvable[];
    /** Permissions required by the user to use the command (Must be a valid [PermissionResolvable]{@link https://discord.js.org/#/docs/main/stable/typedef/PermissionResolvable} array) */
    userPermissions?: PermissionResolvable[];
    /** [nsfw=false] Whether the command is usable only in NSFW channels */
    nsfw?: boolean;
    /** Arguments for the command */
    args?: Argument[];
    /** [hidden=false] Whether the command should be hidden from the help command */
    hidden?: boolean;
    /** A whitelist of users who can use this command, if this is not specified anyone will be able to use it */
    whitelist?: boolean;
    /** A blacklist of users who can't run this command, if this is not specified anyone will be able to use it */
    blacklist?: boolean;
}

export interface Argument {
    /** The expected argument type */
    type: "string" | "number" | "user" | "member" | "role";
    /** The default value of this command, if this is set then this argument becomes optional.
     *  Default values can only appear at the end of the command argument array.
     */
    default?: boolean;
    /** Whether this can be of infinite length, by default each argument is a single word.
     * This can only be specified in the last argument of the array.
     */
    infinite?: boolean;
    /** A function to check if an argument is valid, this is purely optional for stricter checking  */
    validator?: (val: Argument["type"]) => boolean;
}
