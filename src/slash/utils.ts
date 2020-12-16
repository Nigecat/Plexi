import { SlashCommandOption, SlashCommandResponse } from "./SlashCommand";

/**
 * A user option
 * @param description - The description of this option
 * @param required - Whether this option is required
 */
export function user(description: string, required = true): SlashCommandOption {
    return {
        name: "user",
        description,
        type: 6,
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
        type: 8,
        required,
    };
}

/**
 * An ephemeral message
 * @param content - The content of message
 */
export function ephemeral(content: string): SlashCommandResponse {
    return {
        type: 3,
        data: {
            content,
            flags: 1 << 6,
        },
    };
}
