import {
    SlashCommandOption,
    SlashCommandOptionType,
    SlashCommandResponse,
    SlashCommandResponseType,
} from "./SlashCommand";

/**
 * A user option
 * @param description - The description of this option
 * @param required - Whether this option is required
 */
export function user(description: string, required = true): SlashCommandOption {
    return {
        name: "user",
        description,
        type: SlashCommandOptionType.User,
        required,
    };
}
/**
 * A role option
 * @param description - The description of this option
 * @param required - Whether this option is required
 */
export function role(description: string, required = true): SlashCommandOption {
    return {
        name: "role",
        description,
        type: SlashCommandOptionType.Role,
        required,
    };
}

/**
 * A normal message, leaves the source command visible
 * @param content - The content of message
 */
export function message(content: string): SlashCommandResponse {
    return {
        type: SlashCommandResponseType.ChannelMessageWithSource,
        data: {
            content,
        },
    };
}

/**
 * An ephemeral message, leaves the source command visible
 * @param content - The content of message
 */
export function ephemeral(content: string): SlashCommandResponse {
    return {
        type: SlashCommandResponseType.ChannelMessageWithSource,
        data: {
            content,
            flags: 1 << 6,
        },
    };
}

/**
 * A ephemeral message, hides the source command
 * @param content - The content of the message
 */
export function ephemeralHidden(content: string): SlashCommandResponse {
    return {
        type: SlashCommandResponseType.ChannelMessage,
        data: {
            content,
            flags: 1 << 6,
        },
    };
}
