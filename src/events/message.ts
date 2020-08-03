import { Plexi } from "../Plexi";
import { Message } from "discord.js";

export default async function (message: Message, client: Plexi): Promise<void> {
    // Figure out what prefix we are using for this server
    const prefix = client.prefixes
        ? client.prefixes.cache.has(message.guild.id)
            ? client.prefixes.cache.get(message.guild.id)
            : await client.prefixes.fetch(message.guild)
        : client.defaultPrefix;

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
        try {
            if (command.canRun(message)) {
                command.run(message, command.validateArgs(args));
            }
        } catch (err) {
            message.channel.send(err.message);
        }
    }
}
