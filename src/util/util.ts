import Jimp from "jimp";
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


/**
 * Edit an image with the supplied parameters and save to src/commands/resources/temp/<name>.png
 * 
 * @param message The message that the source image is contained in
 * @param name The name of the image modification type
 * @param posterize The level of poterization
 * @param contrast The contrast level
 * @param pixelate The level of pixelation
 * 
 * @returns The relative path of the output file
 */
export async function manipulateImage(message: Message, name: string, posterize: number, contrast: number, pixelate: number = Math.floor(Math.random() * 2 + 2)): Promise<string> {
    return new Promise(async (resolve, reject) => {
        // Ensure that the message has is a valid image
        if ((message.attachments.size > 0 && message.attachments.every(attachIsImage)) || message.embeds.length > 0) {
            // Extract the url out of the attachment object depending on what type of attachment it is
            let url: string = message.embeds.length > 0 ? (message.embeds[0].url || message.embeds[0].image.url) : message.attachments.first().url;
       
            // Remove the ?size= tag from the end of the url if it exists
            url = url.includes("?size=") ? url.split("?size=").slice(0, -1).join("?size=") : url;
            
            (await Jimp.read(url))
                .pixelate(pixelate)
                .posterize(posterize)
                .contrast(contrast)
                .write(`./commands/resources/temp/${name}.png`);

            resolve(`./commands/resources/temp/${name}.png`);
        } else {
            reject("Image not found! (the only supported file types are .png and .jpg)");
        }
    });
}


/**
 * Convert a string to discord regional indicators
 * @param text 
 */
export function toEmoji(data: string): string {
    const text: string[] = data.toLowerCase().replace(/[^A-Za-z\s]/g, "").split("");
    const emojis: object  = {
        a: "🇦", b: "🇧", c: "🇨", d: "🇩", e: "🇪",
        f: "🇫", g: "🇬", h: "🇭", i: "🇮", j: "🇯",
        k: "🇰", l: "🇱", m: "🇲", n: "🇳", o: "🇴",
        p: "🇵", q: "🇶", r: "🇷", s: "🇸", t: "🇹",
        u: "🇺", v: "🇻", w: "🇼", x: "🇽", y: "🇾",
        z: "🇿", " ": "  "
    }
    text.forEach((char, index) => {
        text[index] = emojis[char];
    });
    return text.join(" ");
}