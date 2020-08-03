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
