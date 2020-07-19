import Database from "./models/database.js";
import { Message, Client, Role, User, PermissionFlags } from "discord.js";

/** An optional command argument */
export type Optional<T> = T;

/** Each command must export one of these */
export interface Command {
    args: Array<string | number | Role | User | Optional<string | number | Role | User>>,
    description: string,
    perms: PermissionFlags
}

/** One of these will be passed to a command when it is called */
export interface CommandData {
    client?: Client,
    message?: Message,
    database?: Database
}