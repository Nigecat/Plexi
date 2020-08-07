import { get as httpGet } from "http";
import { get as httpsGet } from "https";
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
    // Return false if the roles are the same
    if (role1.id === role2.id) return false;

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

/**
 * Make a http request and return the result
 * @param {string} url - The url to make the request to
 * @param useHttp - Whether to make the request over http, this is false by default
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fetch(url: string, useHttp = false): Promise<any> {
    return new Promise((resolve, reject) => {
        (useHttp ? httpGet : httpsGet)(url, (resp) => {
            let data = "";

            resp.on("data", (chunk) => {
                data += chunk;
            });

            resp.on("end", () => {
                resolve(JSON.parse(data));
            });

            resp.on("error", reject);
        });
    });
}

/**
 * Attempt to convert the supplied text to milliseconds
 * @param {string} val - The value to convert
 * @returns {number} The number of milliseconds or undefined
 */
export function convertMs(val: string): number {
    // Convert the time metrics to milliseconds
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const year = day * 365.25;

    if (String(val).length > 100) return;

    const match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        val,
    );

    if (!match) return;

    const num = parseFloat(match[1]);
    const type = (match[2] || "ms").toLowerCase();
    switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
            return num * year;
        case "weeks":
        case "week":
        case "w":
            return num * week;
        case "days":
        case "day":
        case "d":
            return num * day;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
            return num * hour;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
            return num * minute;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
            return num * second;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
            return num;
        default:
            return undefined;
    }
}

/**
 * Fetch a random reddit image from the specified subreddit
 * @param {string} subreddit - The subreddit to get the image from, this should just be the name e.g 'aww'
 * @returns A url to the image
 */
export async function fetchReddit(subreddit: string): Promise<string> {
    const response = await fetch(`https://imgur.com/r/${subreddit}/hot.json`);
    const post = response.data[Math.floor(Math.random() * response.data.length)];
    return `http://imgur.com/${post.hash}.${post.mimetype.replace(/.+?(?=\/)/, "").substr(1)}`;
}
