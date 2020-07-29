import { file } from "tmp-promise";
import { read as jimpRead } from "jimp";
import { TextChannel, NewsChannel, DMChannel, Role } from "discord.js";

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
export async function manipulateImage(url: string, posterize: number, contrast: number = 0.75, pixelate: number = Math.floor(Math.random() * 2 + 2)) {
    // Get the file extension from the supplied url
    const ext = "." + url.split(".").pop().split(/\#|\?/)[0];

    // Create a temporary file with the matching extension so discord knows what to do with it when we upload the file
    const { path } = await file({ postfix: ext });

    (await jimpRead(url))
        .pixelate(pixelate)
        .posterize(posterize)
        .contrast(contrast)
        .write(path);

    return path;
}

/**
 * Returns a bool of whether role1 is higher than role2
 * 
 * @param role1 The first user
 * @param role2 The second user
 * 
 * @returns Whether the first role is higher than the second one
 */
export function isHigherRole(role1: Role, role2: Role) {
    // We have to sort the roles of the guild to ensure they are in the correct order
    const guildRoles = role1.guild.roles.cache.sort((b, a) => a.position - b.position || (a.id as any) - (b.id as any)).map(role => role.id);

    for (const i in guildRoles) {
        if (guildRoles[i] === role1.id) {
            return true;
        } else if (guildRoles[i] === role2.id) {
            return false;
        }
    }

    throw new Error("Could not find user role!");
}


/**
 *  Convert the given string to a string using regional indicators
 * @param text The text to convert
 * 
 * @returns The converted text as a string of emojis
 */
export function toEmoji(text: string) {
    let converted = text.toLowerCase().replace(/[^A-Za-z\s]/g, "").split("");

    converted.forEach((char, i) => {
        converted[i] = EMOJIS[char];
    });
    return converted.join(" ");
}

/** Regional indicator emojis */
export const EMOJIS = {
    a: "🇦", b: "🇧", c: "🇨", d: "🇩", e: "🇪",
    f: "🇫", g: "🇬", h: "🇭", i: "🇮", j: "🇯",
    k: "🇰", l: "🇱", m: "🇲", n: "🇳", o: "🇴",
    p: "🇵", q: "🇶", r: "🇷", s: "🇸", t: "🇹",
    u: "🇺", v: "🇻", w: "🇼", x: "🇽", y: "🇾",
    z: "🇿", " ": "  "
}

/** Communism word replacements */
export const COMMUNISM = {
    "my": "our",
    "i": "we",
    "me": "we",
    "your": "our",
    "you": "we",
    "any reason": "for the great communist nation"
}