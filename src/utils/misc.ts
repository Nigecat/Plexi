import { Command } from "../commands/Command";
import { stripIndents, oneLine } from "common-tags";
import { Snowflake, Message, TextChannel, NewsChannel, DMChannel, Role } from "discord.js";

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
        help += `\n**Required Permissions:** \`${command.options.userPermissions.join(" | ")}\``;
    }

    if (command.options.details) help += `\n\n**Details:** ${command.options.details}`;

    return help;
}

/**
 * Get the second last message in a given channel
 *
 * @remarks
 * Useful for finding the message before a command
 *
 * @param channel The channel to look in
 * @returns A promise containing the message that was found
 */
export async function lastMessage(channel: TextChannel | NewsChannel | DMChannel): Promise<Message> {
    const messages = await channel.messages.fetch({ limit: 2 });
    return messages.get(Array.from(messages.keys())[1]);
}

/**
 * Returns a bool of whether role1 is higher than role2
 *
 * @param {Role} role1 The first user
 * @param {Role} role2 The second user
 * @returns Whether the first role is higher than the second one
 */
export function isHigherRole(role1: Role, role2: Role): boolean {
    // We have to sort the roles of the guild to ensure they are in the correct order
    const guildRoles = role1.guild.roles.cache
        .sort((b, a) => a.position - b.position || ((a.id as unknown) as number) - ((b.id as unknown) as number))
        .map((role) => role.id);

    for (const i in guildRoles) {
        if (guildRoles[i] === role1.id) {
            return true;
        } else if (guildRoles[i] === role2.id) {
            return false;
        }
    }

    throw new Error("Could not find role!");
}
