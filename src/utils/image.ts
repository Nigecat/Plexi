import Jimp from "jimp";

/**
 * Check if the supplied string is a valid discord attachment/embed image url
 * @param {string} url - The url to check
 * @returns Whether it is or not
 */
export function isDiscordURL(url: string): boolean {
    return url.match(/(http(s):\/\/?)(cdn|media).?discord(app?).(com|net)\/(attachments|icons)\//) !== null;
}

/**
 * Edit an image with the supplied parameters
 *
 * @param message The url of the source image
 * @param posterize The level of poterization
 * @param contrast The contrast level
 * @param pixelate The level of pixelation
 *
 * @returns A buffer of the image
 */
export async function manipulateImage(
    url: string,
    posterize: number,
    contrast = 0.75,
    pixelate: number = Math.floor(Math.random() * 2 + 2),
): Promise<Buffer> {
    const img = await Jimp.read(url);
    img.pixelate(pixelate).posterize(posterize).contrast(contrast);
    const imgBuf = await img.getBufferAsync((Jimp.AUTO as unknown) as string);

    return imgBuf;
}
