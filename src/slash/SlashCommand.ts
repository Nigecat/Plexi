import axios from "axios";
import { Plexi } from "../Plexi";
import { DISCORD_API } from "../constants";
import { MessageEmbed, MessageMentionOptions } from "discord.js";

/** A [slash command]{@link https://discord.com/developers/docs/interactions/slash-commands} */
export abstract class SlashCommand {
    /** The name of this slash command */
    public readonly name: string;

    constructor(public readonly client: Plexi, public readonly options: SlashCommandInfo) {
        this.name = options.name;
        this.options.options = this.options.options || [];

        // Register this comamnd as global if we are in production
        // Otherwise set it to be local within our dev server
        const url =
            process.env.NODE_ENV === "production" || !client.config.devServerId
                ? `${DISCORD_API}/applications/${client.user.id}/commands`
                : `${DISCORD_API}/applications/${client.user.id}/guilds/${client.config.devServerId}/commands`;
        axios({
            method: "post",
            url,
            data: options,
            headers: {
                Authorization: `Bot ${client.token}`,
            },
        }).catch((err) => this.client.emit("error", err));
    }

    /**
     * The handler for a slash command, this should be overridden by the inherited class
     * @param {InteractionData} interaction - The interaction event that triggered the command
     * @param {InteractionDataOptions} args - The user supplied args
     * @returns The response to the command
     * @abstract
     */
    abstract handler(
        interaction: InteractionData,
        args?: InteractionDataOptions,
    ): void | Promise<void> | SlashCommandResponse | Promise<SlashCommandResponse>;
}

/** The type the response is */
export enum SlashCommandResponseType {
    /** ACK a `ping` */
    Pong = 1,
    /** ACK a command without sending a message, eating the user's input (this is the default) */
    Acknowledge = 2,
    /** Respond with a message, eating the user's input */
    ChannelMessage = 3,
    /** Response with a message, showng the user's input */
    ChannelMessageWithSource = 4,
    /** ACK a command without sending a message, showing the user's input */
    ACKWithSource = 5,
}

/** The response to a slash command */
export interface SlashCommandResponse {
    /** The type this response is */
    type: SlashCommandResponseType;
    /** An optional response message */
    data?: SlashCommandResponseData;
}

export interface SlashCommandResponseData {
    /** Message content */
    content: string;
    /** Response flags
     * 64 (1 << 6): An ephemeral message - only the user that invoked the command will be able to see the response
     */
    flags?: number;
    /** Is the response tts */
    tts?: boolean;
    /** Message embeds, supports up to 10 */
    embeds?: MessageEmbed[];
    /** Allowed message mentions */
    allows_mentions?: MessageMentionOptions;
}

/** The information required to create a new slash command */
export interface SlashCommandInfo {
    /** The name of this command */
    name: string;
    /** The description of this command */
    description: string;
    /** The options of this command */
    options?: SlashCommandOption[];
}

/** The type of option this is */
export enum SlashCommandOptionType {
    SubCommand = 1,
    SubCommandGroup = 2,
    String = 3,
    Integer = 4,
    Boolean = 5,
    User = 6,
    Channel = 7,
    Role = 8,
}

/** A single option for a slash command */
export interface SlashCommandOption {
    /** The name of this option */
    name: string;
    /** The description of this option */
    description: string;
    /** The type of option this is */
    type: SlashCommandOptionType;
    /** Whether this option is required */
    required?: boolean;
    /** Whether this option is the default */
    default?: boolean;
    /** The options for this option (nested options) */
    options?: SlashCommandOption[];
    /** The choices for the user to pick from */
    choices?: {
        name: string;
        value: string;
    }[];
}

export type InteractionDataOptions = {
    name: string;
    value?: string;
    options?: InteractionDataOptions;
}[];

export interface InteractionData {
    version: number;
    type: number;
    token: string;
    member: {
        user: {
            username: string;
            public_flages: number;
            id: string;
            discriminator: string;
            avatar: string;
        };
        roles: string[];
        premium_since?: boolean;
        permissions: string;
        pending: boolean;
        nick?: string;
        mute: boolean;
        joined_at: string;
        is_pending: boolean;
        deaf: boolean;
    };
    id: string;
    guild_id: string;
    channel_id: string;
    data: {
        name: string;
        id: string;
        /** The options the user chose */
        options?: InteractionDataOptions;
    };
}
