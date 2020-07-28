import { file } from "tmp-promise";
import { read as jimpRead } from "jimp";
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


/**
 * Check if a string is a valid url
 * 
 * @param url The url to check
 * @returns Whether it is a valid url or not
 */
export function isURL(url: string) {
    return url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) !== null;
}


/**
 * Edit an image with the supplied parameters
 * 
 * @param message The url of the source image
 * @param posterize The level of poterization
 * @param contrast The contrast level
 * @param pixelate The level of pixelation
 * 
 * @returns The path of the output file
 */
export async function manipulateImage(url: string, posterize: number, contrast: number, pixelate: number = Math.floor(Math.random() * 2 + 2)) {
    const { path } = await file({ postfix: ".png" });

    (await jimpRead(url))
        .pixelate(pixelate)
        .posterize(posterize)
        .contrast(contrast)
        .write(path);

    return path;
}