import { file } from "tmp-promise";
import { read as jimpRead } from "jimp";

/**
 * Check if the supplied string is a valid discord attachment/embed image url
 * @param {string} url - The url to check
 * @returns Whether it is or not
 */
export function isDiscordURL(url: string): boolean {
    return url.match(/(http(s):\/\/?)cdn.?discord(app?).com\/(attachments|icons)\//) !== null;
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
export async function manipulateImage(
    url: string,
    posterize: number,
    contrast = 0.75,
    pixelate: number = Math.floor(Math.random() * 2 + 2),
): Promise<string> {
    // Get the file extension from the supplied url
    const ext = "." + url.split(".").pop().split(/#|\?/)[0];

    // Create a temporary file with the matching extension so discord knows what to do with it when we upload the file
    const { path } = await file({ postfix: ext });

    (await jimpRead(url)).pixelate(pixelate).posterize(posterize).contrast(contrast).write(path);

    return path;
}
