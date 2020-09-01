import { Plexi } from "../Plexi";
import argumentTypes from "./types";
import { oneLine, stripIndents } from "common-tags";
import { PermissionResolvable, Message, Snowflake, User, GuildMember, Role } from "discord.js";

/** A command that can be run in a client */
export abstract class Command {
    /** The name of this command */
    public readonly name: string;

    /** The format of the command (this is auto generated for the help command) */
    public format: string;

    constructor(public readonly client: Plexi, public readonly options: CommandInfo) {
        this.name = options.name;

        // Set the defaults
        this.options.description = this.options.description || "";
        this.options.details = this.options.details || "";
        this.options.aliases = this.options.aliases || [];
        this.options.guildOnly = this.options.guildOnly || false;
        this.options.dmOnly = this.options.dmOnly || false;
        this.options.ownerOwnly = this.options.ownerOwnly || false;
        this.options.clientPermissions = this.options.clientPermissions || [];
        this.options.userPermissions = this.options.userPermissions || [];
        this.options.nsfw = this.options.nsfw || false;
        this.options.args = this.options.args || [];
        this.options.hidden = this.options.hidden || false;

        this.format = this.options.args.reduce((prev, arg) => {
            if (arg.oneOf) arg.name = arg.oneOf.join(" | ");
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
        // Ok so we have to do a bit of thinking to get the arguments to parse correctly.
        // First, we create a variable to keep track of whether or not these arguments are valid.
        // This is necessary since we are unable to directly return from the foreach callback.
        //
        // The main parser expects there to be the same number of incoming arguments as the command expects.
        // So first we iterate through each argument,
        //      and if it has a default and the position has not been specified in the incoming arguments,
        //      then we assign that argument to be the default.
        //
        // Now we should have the same number of arguments as the expected arguments apart from infinite arguments.
        // Luckily, infinite arguments can only appear at the end of an argument list.
        // So if we detect that we have an infinite argument we can take all of the arguments past it.
        //      and collapse them into a single string at the end.
        // This works since even though the caller splits the arguments into single words,
        //      the parser doesn't actually care what the content of each array element is,
        //      so it will happily parse an element with multiple words in it.
        //
        // At this point we should have the same number of incoming arguments as expected,
        //      if we don't then we know that we must have recieved an invalid argument,
        //      so we can immediately return that the arguments are invalid.
        //
        // Now we can easily map the arguments 1:1 since there are the same ammount of incoming/expected arguments.
        // So we loop through each of the incoming arguments to process them seperately.
        // For each argument we do the following (if any of these fail then we mark the arguments as invalid):
        //      1. Check if this argument is the same as the default argument.
        //          - If this is true then we skip any other checks,
        //                  this allows the default to not be restricted by the argument type.
        //      2. If this command has a 'oneOf' property set then check if the incoming argument is in it.
        //      3. We then check if the incoming argument parses the validator of the expected type.
        //      4. After validating the type, we parse the argument from the incoming string to the actual expected type.
        //      5. If this command has a validator for this argument we run it through that as well.
        //      6. The parsed and validated argument gets added to an array of valid arguments.
        //
        // If all of the previous steps have passed for all the arguments then we return the formatted arguments.
        // Otherwise we return that the arguments were not valid.

        let isValid = true;

        // Assign any default values if we need them
        this.options.args.forEach((arg, i) => {
            if (arg.default && args[i] === undefined) args[i] = arg.default;
        });

        // If we have any infinite args then collapse the end arguments into a single string
        if (this.options.args.some((arg) => arg.infinite)) {
            args[this.options.args.length - 1] = args.slice(this.options.args.length - 1).join(" ");
            // If the infinite argument is empty then invalidate the arguments,
            //  We do not want an empty string to be parsed
            if (args[this.options.args.length - 1] === "") {
                isValid = false;
                return { isValid, formattedArgs: args };
            }
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
            // Skip any checks if we are using the default argument
            if (arg === this.options.args[i].default) return arg;

            // If we have the 'oneOf' property set then check if the argument we are receiving is not in it
            if (
                this.options.args[i].oneOf &&
                !this.options.args[i].oneOf.map((el) => el.toLowerCase()).includes(arg.toLowerCase())
            ) {
                isValid = false;
            }

            // Check if this argument is valid
            if (argumentTypes[this.options.args[i].type].validate(arg, this.client, message)) {
                // If it is then parse it to the expected object
                const parsed = argumentTypes[this.options.args[i].type].parse(arg, this.client, message);
                // Check the validator
                if (this.options.args[i].validate ? this.options.args[i].validate(arg) : true) {
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
    abstract run(message: Message, args?: ArgumentTypeArray): void | Promise<void>;
}

export interface CommandInfo {
    /** The name of the command */
    name: string;
    /** Alternative command names */
    aliases?: string[];
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
    type: "string" | "number" | "user" | "member" | "role" | "boolean";
    /** The default value of this command, if this is set then this argument becomes optional.
     *  Default values can only appear at the end of the command argument array.
     */
    default?: string;
    /** Whether this can be of infinite length, by default each argument is a single word.
     * This can only be specified in the last argument of the array.
     */
    infinite?: boolean;
    /** A function to check if an argument is valid, this is purely optional for stricter checking  */
    validate?: (val: string | number | User | GuildMember | Role | boolean) => boolean;
    /** The incoming argument must be one of these, this array should be all lowercase */
    oneOf?: string[];
}

export type ArgumentTypeArray = Array<string | number | User | GuildMember | Role | boolean>;
