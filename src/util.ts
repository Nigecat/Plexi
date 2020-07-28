import { TextChannel, NewsChannel, DMChannel } from "discord.js";

/**
 * Get the second last message in a given channel
 * 
 * @remarks
 * Useful for finding the message before a command
 * 
 * @param channel The channel to look in
 * @returns A promise containing the message that was found
 */
export async function lastMessage(channel: (TextChannel | NewsChannel | DMChannel)) {
    const messages = await channel.messages.fetch({ limit: 2 });
    return messages.get(Array.from(messages.keys())[1]);
}