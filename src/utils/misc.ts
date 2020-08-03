import { Plexi } from "../Plexi";
import { Snowflake, Message } from "discord.js";
import { Command } from "../commands/Command";
import { stripIndents, oneLine } from "common-tags";

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

/** Generate a help string for a command
 * @param {Command} command - The command to generate it for
 * @returns The help string
 */
export function generateHelp(command: Command): string {
    let help = stripIndents`
        ${oneLine`
            Command **${command.name}**: ${command.options.description}
            ${command.options.guildOnly ? " (Usably only in servers) " : ""}
            ${command.options.dmOnly ? " (Usably only in dms) " : ""}
            ${command.options.nsfw ? " (NSFW) " : ""}
        `}

        **Format:** \`${command.name} ${command.format}\`
        **Group:** \`${command.options.group}:${command.name}\`
    `;

    if (command.options.userPermissions.length > 0) {
        help += `\n**Required Permissions:** ${command.options.userPermissions.join(" | ")}`;
    }

    if (command.options.details) help += `\n**Details:** ${command.options.details}`;

    return help;
}

/** Get the prefix to use with a message
 * @param {Message} message - The message to get the prefix for
 * @param {Plexi} client - The client to get the prefix from
 * @returns {RegExp} The prefix
 */
export async function getPrefix(message: Message, client: Plexi): Promise<RegExp> {
    return client.prefixes && message.guild
        ? client.prefixes.cache.has(message.guild.id)
            ? client.prefixes.cache.get(message.guild.id)
            : await client.prefixes.fetch(message.guild.id)
        : client.defaultPrefix;
}
