import { Message, Client } from "discord.js";
import Database from "./Database";

export default interface Command {
    args?: ( string | string[] );
    perms?: string[];
    description: string;
    call(message?: Message, args?: (string | string[]), database?: Database, client?: Client): ( void | Promise<void> );  
}