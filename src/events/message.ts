import { Plexi } from "../Plexi";
import { Message } from "discord.js";
import { generateRegExp, generateHelp } from "../utils/misc";

/** Main handler for incoming commands */
export default async function (client: Plexi, [message]: [Message]): Promise<void> {
    // Ignore bot messages
    if (message.author.bot) return;

    // Figure out what prefix we are using for this server
    const prefixRaw =
        message.guild && client.database
            ? (await client.database.getGuild(message.guild.id)).prefix
            : client.config.prefix;
    const prefix = generateRegExp(prefixRaw, client.config.prefix);

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
                // Otherwise it's an invalid syntax warning so we send the help page
                message.channel.send(generateHelp(command, prefixRaw));
            }
        } else {
            message.channel.send(invalidRunReason);
        }
    }
}
