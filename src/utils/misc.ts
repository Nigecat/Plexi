import { get as httpGet } from "http";
import { get as httpsGet } from "https";
import { stripIndents } from "common-tags";
import { Command } from "../commands/Command";
import { Snowflake, Message, TextChannel, NewsChannel, DMChannel, MessageReaction } from "discord.js";

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
export function generateHelp(command: Command, prefix?: string): string {
    let help = stripIndents`
        ${prefix ? prefix : ""}${command.name} ${command.format}

        ${command.options.description} ${command.options.nsfw ? " (NSFW) " : ""}
    `;

    if (command.options.userPermissions.length > 0) {
        help += `\nRequired Permissions: ${command.options.userPermissions.join(", ")}`;
    }

    if (command.options.details) help += `\n\n-------------------------------\n${command.options.details}`;

    return "```\n" + help + "\n```";
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

/**
 * Get confirmation of something. Waits for the user to react to the message with y/n.
 * @param {Snowflake} id - The id of the user to react for a reaction from.
 * @param {Message} message - The message to display the confirmation on
 * @returns The reaction result
 */
export async function confirm(id: Snowflake, message: Message): Promise<boolean> {
    await message.react("🇾");
    await message.react("🇳");

    const response = await message.awaitReactions(
        (reaction: MessageReaction) =>
            ["🇾", "🇳"].includes(reaction.emoji.name) && reaction.users.cache.some((reactUser) => reactUser.id === id),
        { max: 1, time: 25000 },
    );

    await message.reactions.removeAll();

    return response.size > 0 ? response.first().emoji.name === "🇾" : false;
}

/**
 * Get n random elements of the supplied array
 * @param {ReadonlyArray<T>} arr - The array to get elements from
 * @param {number} n - The number of random elements to get
 * @returns The random elements
 */
export function getRandom<T>(arr: ReadonlyArray<T>, n: number): Array<T> {
    const result = new Array(n);
    let len = arr.length;
    const taken = new Array(len);
    if (n > len) throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        const x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}
