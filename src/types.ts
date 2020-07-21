import Database from "./models/database.js";
import { Message, Client, NewsChannel, TextChannel, PermissionString } from "discord.js";

/** Each command must export one of these 
 *      NOTE: The args are purely for the help command, argument checking must be done by the command itself
 */
export interface Command {
    args?: string[],
    description?: string,
    perms?: PermissionString[], 
    call: (args0: CommandData) => void | Promise<void>
}

/** One of these will be passed to a command when it is called */
export interface CommandData {
    client?: Client,
    message?: CommandMessage,
    database?: Database,
    args?: string[]
}

/** The message type that gets passed to our commands
 *      it is the same as a normal message but we know that the channel can't be a dm channel
 */
interface CommandMessage extends Omit<Message, "channel"> {
    channel: TextChannel | NewsChannel
}

/** Custom error class that commands are expected to throw if an invalid argument is sent */
export class InvalidArgument extends Error { }