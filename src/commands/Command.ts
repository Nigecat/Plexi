import { Plexi } from "../Plexi";
import argumentTypes from "./types";
import { oneLine, stripIndents } from "common-tags";
import { PermissionResolvable, Message, Snowflake, User, GuildMember, Role } from "discord.js";

/** A command that can be run in a client */
export class Command {
    /** The name of this command */
    public readonly name: string;

    /** The format of the command (this is auto generated for the help command) */
    public format: string;

    constructor(public readonly client: Plexi, public readonly options: CommandInfo) {
        this.name = options.name;

        // Set the defaults
        this.options.description = this.options.description || "";
        this.options.details = this.options.details || "";
        this.options.guildOnly = this.options.guildOnly || false;
        this.options.dmOnly = this.options.dmOnly || false;
        this.options.ownerOwnly = this.options.ownerOwnly || false;
        this.options.clientPermissions = this.options.clientPermissions || [];
        this.options.userPermissions = this.options.userPermissions || [];
        this.options.nsfw = this.options.nsfw || false;
        this.options.args = this.options.args || [];
        this.options.hidden = this.options.hidden || false;

        this.format = this.options.args.reduce((prev, arg) => {
            const wrapL = arg.default !== null ? "[" : "<";
            const wrapR = arg.default !== null ? "]" : ">";
            return `${prev}${prev ? " " : ""}${wrapL}${arg.name}${arg.infinite ? "..." : ""}${wrapR}`;
        }, "");
    }

    /** Given a message check if the options of this command will allow it to run
     * @param {Message} message - The message object that this would be running with
     * @returns {boolean} Whether this is runnable or not, it will through an error if it is not with the details
     * @internal
     */
    canRun(message: Message): { canRun: boolean; invalidRunReason: string } {
        let canRun = true;
        let invalidRunReason = "";

        // If this command is dm only and this is a non-dm channel
        if (this.options.dmOnly && message.channel.type !== "dm") {
            canRun = false;
            invalidRunReason = "This command must be run in a dm channel.";
        }

        // If this command is guild only and we don't have a guild in the message
        if (this.options.guildOnly && !message.guild) {
            canRun = false;
            invalidRunReason = "This command must be run in a guild channel.";
        }

        // We want to fail silently if normal users aren't meant to run this command
        if (this.options.ownerOwnly && message.author.id !== this.client.config.owner) {
            canRun = false;
        }

        // If this command was sent in a guild and the client does not have all the required permissions
        if (message.guild && !this.options.clientPermissions.every((perm) => message.guild.me.hasPermission(perm))) {
            canRun = false;
            invalidRunReason = oneLine`
                I am missing permission(s) \`${this.options.clientPermissions.join(" | ")}\` to run this command. 
                Please get an administrator to add them before running this command.
            `;
        }

        // If this command was sent in a guild and the member does not have all the required permissions
        if (message.guild && !this.options.userPermissions.every((perm) => message.member.hasPermission(perm))) {
            canRun = false;
            invalidRunReason = oneLine`
                You are missing permission(s) \`${this.options.userPermissions.join(" | ")}\` 
                to run this command.
            `;
        }

        // If this is an nsfw command and we are not in an nsfw channel (this rule is skipped in dm channels)
        if (this.options.nsfw && (message.channel.type !== "dm" ? !message.channel.nsfw : false)) {
            canRun = false;
            invalidRunReason = "This command must be run in an nsfw channel.";
        }

        // Check if a whitelist has been set and this user is not in our whitelist (this will fail silently)
        if (this.options.whitelist && !this.options.whitelist.includes(message.author.id)) {
            canRun = false;
        }

        // Check if a blacklist has been set and this user is in our blacklist
        if (this.options.blacklist && this.options.blacklist.includes(message.author.id)) {
            canRun = false;
            invalidRunReason = stripIndents`
                It appears you have been force blacklisted from this command by the bot owner :thinking:,
                you probably already know why.
            `;
        }

        return { canRun, invalidRunReason };
    }

    /** Given an array of arguments check if they match the specified args of this command.
     * If any of the args are invalid this will through an error
     * @param {ArgumentArray} args - The args to check
     * @returns The formatted arguments (converts things to their actual objects)
     * @internal
     */
    validateArgs(args: string[], message: Message): { isValid: boolean; formattedArgs: ArgumentTypeArray } {
        let isValid = true;

        // Assign any default values if we need them
        this.options.args.forEach((arg, i) => {
            if (arg.default && args[i] === undefined) args[i] = arg.default;
        });

        // If we have any infinite args then collapse the end arguments into a single string
        if (this.options.args.some((arg) => arg.infinite)) {
            args[this.options.args.length - 1] = args.slice(this.options.args.length - 1).join(" ");
            // Shorten the array to remove any trailing arguments
            args.length = this.options.args.length;
        }

        // If we don't have the matching number of arguments now then we know something must have gone wrong
        if (args.length !== this.options.args.length) {
            isValid = false;
            return { isValid, formattedArgs: args };
        }

        // Check each argument seperately
        args = args.map((arg, i) => {
            // Check if this argument is valid
            if (argumentTypes[this.options.args[i].type].validate(arg, this.client, message)) {
                // If it is then parse it to the expected object
                const parsed = argumentTypes[this.options.args[i].type].parse(arg, this.client, message);
                // Only check the validator if we aren't using the default
                if (
                    arg === this.options.args[i].default ||
                    (this.options.args[i].validate ? this.options.args[i].validate(arg) : true)
                ) {
                    return parsed;
                } else {
                    isValid = false;
                }
            } else {
                isValid = false;
            }
        });

        return { isValid, formattedArgs: args };
    }

    /** The function to run this command, this should be overridden by the inherited class
     * @param {Message} message - The incoming message object
     * @param {ArgumentTypeArray} args - The incoming arguments, this will be an array matching the specified {@link Argument} array
     * (each element will be automatically converted to the specified type prior to calling the run function).
     * @abstract
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    run(message: Message, args: ArgumentTypeArray): void {
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
    /** [guildOnly=false] Whether or not this command should only function in a dm channel */
    dmOnly?: boolean;
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
    whitelist?: Snowflake[];
    /** A blacklist of users who can't run this command, if this is not specified anyone will be able to use it */
    blacklist?: Snowflake[];
}

export interface Argument {
    /** The name of the argument, this is used for the help screen */
    name: string;
    /** The expected argument type */
    type: "string" | "number" | "user" | "member" | "role";
    /** The default value of this command, if this is set then this argument becomes optional.
     *  Default values can only appear at the end of the command argument array.
     */
    default?: string;
    /** Whether this can be of infinite length, by default each argument is a single word.
     * This can only be specified in the last argument of the array.
     */
    infinite?: boolean;
    /** A function to check if an argument is valid, this is purely optional for stricter checking  */
    validate?: (val: string | number | User | GuildMember | Role) => boolean;
}

export type ArgumentTypeArray = Array<string | number | User | GuildMember | Role>;
