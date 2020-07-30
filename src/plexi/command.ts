import { PlexiClient } from "./client";
import { Message, PermissionResolvable } from "discord.js";

export class Command {
    public client: PlexiClient;
    public readonly name: CommandOptions["name"];
    public readonly description: CommandOptions["description"];
    public readonly userPermissions: CommandOptions["userPermissions"];
    public readonly clientPermissions: CommandOptions["clientPermissions"];
    public readonly hidden: CommandOptions["hidden"];
    public readonly ownerOnly: CommandOptions["ownerOnly"];
    public readonly guildOnly: CommandOptions["guildOnly"];
    public readonly dmOnly: CommandOptions["dmOnly"];
    public readonly args: CommandOptions["args"];

    constructor(client: PlexiClient, options: CommandOptions) {
        this.client = client;
        this.name = options.name;
        this.description = options.description;
        this.userPermissions = options.userPermissions || [];
        this.clientPermissions = options.clientPermissions || [];
        this.hidden = options.hidden || false;
        this.ownerOnly = options.ownerOnly || false;
        this.guildOnly = options.guildOnly || false;
        this.dmOnly = options.dmOnly || false;
        this.args = options.args || [];
    }

    async run(message: Message, args?: any) {
        message.channel.send("Error: Command not implemented!");
    }
}

export interface CommandOptions {
    name: string,
    description: string,
    userPermissions?: PermissionResolvable[],
    clientPermissions?: PermissionResolvable[],
    hidden?: boolean,
    ownerOnly?: boolean,
    guildOnly?: boolean,
    dmOnly?: boolean,
    args?: CommandArgument[]
}

export interface CommandArgument {
    key: string,
    validator?: (arg: any) => boolean,
    type?: "string" | "number" | "role" | "member" | "user" | "channel" | "text-channel" | "voice-channel"
    oneOf?: string[],
    infinite?: boolean,
    default?: any
}