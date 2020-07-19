import Database from "./models/database.js";
import { Message, Client, Role, User, NewsChannel, TextChannel, PermissionString } from "discord.js";

/** An optional command argument */
export type Optional<T> = T;

/** Each command must export one of these */
export interface Command {
    args?: Array<string | number | typeof Role | typeof User | Array<string | number | typeof Role | typeof User> | Optional<string | number | typeof Role | typeof User>>,
    description?: string,
    perms?: PermissionString[], 
    call: (args0: CommandData) => void | Promise<void>
}

/** One of these will be passed to a command when it is called */
export interface CommandData {
    client?: Client,
    message?: CommandMessage,
    database?: Database,
    args: Array<string | number | Role | User>
}

/** The message type that gets passed to our commands
 *      it is the same as a normal message but we know that the channel can't be a dm channel
 */
interface CommandMessage extends Omit<Message, "channel"> {
    channel: TextChannel | NewsChannel
}