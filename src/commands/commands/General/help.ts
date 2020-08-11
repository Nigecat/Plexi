import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { Message, MessageEmbed } from "discord.js";
import { generateHelp } from "../../../utils/misc";

export default class Help extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "help",
            description: "Displays a list of available commands, or detailed information for a specified command",
            group: "General",
            args: [{ name: "command", type: "string", default: "SHOW_ALL" }],
        });
    }

    async run(message: Message, [command]: [string]): Promise<void> {
        // If it is a specific help command
        if (command !== "SHOW_ALL") {
            // Only show the help if we have the command and it is not owner only
            if (this.client.commands.has(command) && !this.client.commands.get(command).options.ownerOwnly) {
                message.channel.send(generateHelp(this.client.commands.get(command)));
            }
        }

        // Otherwise it is a general help command
        else {
            const prefix = await this.client.prefixes.get(message.guild ? message.guild.id : "", true);

            const groups = [...new Set(this.client.commands.array().map((command) => command.options.group))];

            const embed = new MessageEmbed({
                color: "RANDOM",
                title: "Plexi Help",
                description: `Run ${prefix}help <command> for more details on a command`,
                footer: { text: `This server's prefix is: ${prefix}`, iconURL: this.client.user.avatarURL() },
                fields: groups.map((group) => {
                    return {
                        name: group,
                        value: this.client.commands
                            .filter((command) => command.options.group === group)
                            .map((command) => `\`${command.name}\``)
                            .join(", "),
                    };
                }),
            });

            message.channel.send({ embed });
        }
    }
}
