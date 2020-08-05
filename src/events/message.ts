import { Plexi } from "../Plexi";
import { Message } from "discord.js";
import { stripIndents } from "common-tags";

/** Main handler for incoming commands */
export default async function (message: Message, client: Plexi): Promise<void> {
    // Ignore bot messages
    if (message.author.bot) return;

    checkSomeone(message);

    // Figure out what prefix we are using for this server
    const prefix = await client.prefixes.get(message.guild ? message.guild.id : "");

    // If this message matches the prefix
    if (message.content.match(prefix)) {
        // Extract the command name from the message, this is the first word after the prefix
        const commandName = message.content.match(prefix)[2].toLowerCase();

        // Extract the args and remove any blank entries
        const args = message.content
            .replace(prefix, "")
            .trim()
            .split(" ")
            .filter((arg) => arg); // This line prevents any blank arguments from getting through, things will break if it is removed

        // Do nothing if we do not have a command with this name
        if (!client.commands.has(commandName)) return;

        const command = client.commands.get(commandName);

        // Check if we can run this command
        const { canRun, invalidRunReason } = command.canRun(message);
        if (canRun) {
            const { isValid, formattedArgs } = command.validateArgs(args, message);
            if (isValid) {
                client.emit("debug", `Running command ${command.options.group}:${commandName}`);
                command.run(message, formattedArgs);
            } else {
                // Otherwise it's an invalid syntax warning so we send the expected syntax
                const prefix = await client.prefixes.get(message.guild ? message.guild.id : "", true);

                message.channel.send(stripIndents`
                    Invalid command syntax, expect syntax: \`${prefix}${command.name} ${command.format}\`
                    Run \`${prefix}help ${command.name}\` for more details
                `);
            }
        } else {
            message.channel.send(invalidRunReason);
        }
    }
}

/**
 * @ someone feature replication see https://youtu.be/BeG5FqTpl9U
 * Requires a role called 'someone' to exist and be pinged
 * @param {Message} message - The incoming message
 */
async function checkSomeone(message: Message): Promise<void> {
    if (message.mentions.roles.size > 0 && message.mentions.roles.some((role) => role.name === "someone")) {
        const role = message.guild.roles.cache.find((role) => role.name === "someone");
        if (role) {
            const member = await message.guild.members.cache.random().roles.add(role);
            const ping = await message.channel.send(role, {
                allowedMentions: { roles: [role.id] },
                disableMentions: "everyone",
            });
            await ping.delete();
            await member.roles.remove(role);
        }
    }
}
