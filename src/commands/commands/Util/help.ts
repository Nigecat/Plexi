import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { stripIndents } from "common-tags";
import { generateHelp } from "../../../utils/misc";

export default class Help extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "help",
            description: "Displays a list of available commands, or detailed information for a specified command",
            group: "Util",
            args: [{ name: "command", type: "string", default: "SHOW_ALL" }],
        });
    }

    async run(message: Message, [command]: [string]): Promise<void> {
        // If it is a specific help command
        if (command !== "SHOW_ALL") {
            if (this.client.commands.has(command)) {
                message.channel.send(generateHelp(this.client.commands.get(command)));
            }
        }

        // Otherwise it is a general help command
        else {
            const prefix = message.guild
                ? (await this.client.prefixes.getRaw(message.guild.id)) || this.client.config.prefix
                : this.client.config.prefix;

            // Extract the command groups
            const groups = [...new Set(this.client.commands.array().map((command) => command.options.group))];

            /* eslint-disable prettier/prettier */
            message.author.send(stripIndents`
                To run a command use \`${prefix}command\` or \`@${this.client.user.tag} command\`.

                Use \`${prefix}help <command>\` to view detailed information about a specific command.
                Use \`${prefix}help\` to view this page.

                ${groups.map((group) => stripIndents`
                    __${group}__
                    ${this.client.commands
                        .array()
                        .filter((command) => command.options.group === group && !command.options.hidden)
                        .map((command) => stripIndents`
                            **${command.name}:** ${command.options.description}${command.options.nsfw ? " (NSFW) " : ""}
                        `).join("\n")}
                `).join("\n\n")}
            `, { split: true });
            /* eslint-enable prettier/prettier */

            if (message.channel.type !== "dm") {
                message.channel.send("Sent you a DM with information.");
            }
        }
    }
}