import Database from "./database.js";
import { CommandOptions, Message, CommandClient } from "eris";

export interface CommandData {
    message?: Message,
    args?: string[],
    database?: Database,
    client?: CommandClient
}

export interface Server {
    id: string,
    prefix: string
}

export interface Command {
    options: CommandOptions,
    call: (data: CommandData) => (any | Promise<any>)
}