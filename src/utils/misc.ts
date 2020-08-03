import { Snowflake } from "discord.js";

/** Generates the regex for detecting when a string starts with either a prefix or a user/bot mention
 *  NOTE: This *requires* there to be text after the match, the string can't only contain the prefix/mention
 * @param {string} prefix - The prefix to detect
 * @param {Snowflake} id - The id of the user/bot to detect
 * @returns The resulting regular expression
 */
export function generateRegExp(prefix: string, id: Snowflake): RegExp {
    return new RegExp(`^(<@!?${id}>\\s+(?:\\${prefix}\\s*)?|\\${prefix}\\s*)([^\\s]+)`, "i");
}

/** Given a string extract all the digits in it, returns a continous string of all the contained digits
 * @param {string} text - The text to extract from
 * @returns {string} The extracted digits
 */
export function extractDigits(text: string): string {
    return (text.match(/\d+/g) || []).join("");
}
