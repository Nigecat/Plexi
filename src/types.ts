import Database from "./models/database.js";
import { Message, Client, Role, User, PermissionFlags, NewsChannel, TextChannel } from "discord.js";

/** An optional command argument */
export type Optional<T> = T;

/** Each command must export one of these */
export interface Command {
    args?: Array<string | number | Role | User | Optional<string | number | Role | User>>,
    description?: string,
    perms?: PermissionFlags,
    call: (args0: CommandData) => void | Promise<void>
}

/** One of these will be passed to a command when it is called */
export interface CommandData {
    client?: Client,
    message?: CommandMessage,
    database?: Database
}

/** The message type that gets passed to our commands
 *      it is the same as a normal message but we know that the channel can't be a dm channel
 */
interface CommandMessage extends Omit<Message, "channel"> {
    channel: TextChannel | NewsChannel
}