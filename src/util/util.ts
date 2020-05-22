import { Message, Collection, Snowflake, TextChannel, DMChannel, NewsChannel, MessageAttachment } from "discord.js";

/**
 * Get the second last message in a given channel
 * 
 * @remarks
 * Useful for finding the message before a command
 * 
 * @param channel The channel to look in
 * @returns A promise containing the message that was found
 */
export async function lastMessage(channel: (TextChannel | DMChannel | NewsChannel)): Promise<Message> {
    return new Promise(async resolve => {
        const messages: Collection<Snowflake, Message> = await channel.messages.fetch({ limit: 2 });
        resolve(messages.get(Array.from(messages.keys())[1]));
    });
}


/**
 * Correctly format text for a discord markdown block
 * 
 * @param data An array, each element is a line of the markdown
 * @returns The properly formated data ready to send directly to discord
 */
export function formatMarkdown(data: string[]): string {
    return `\`\`\`markdown\n${data.join("\n")}\`\`\``;
}


/**
 * Check if a message attachment is a valid image
 * 
 * @param msgAttach The message attachment object
 * @returns Whether or not it is a valid image
 */
export function attachIsImage(msgAttach: MessageAttachment): boolean {
    const url: string = msgAttach.url.toLowerCase();
    // true if this url is a png or jpg image.
    return url.endsWith("png") || url.endsWith("jpg");
}