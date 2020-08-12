import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { stripIndents } from "common-tags";
import { Message, MessageEmbed } from "discord.js";

export default class Shutdown extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "shutdown",
            description: "Shutdown the bot and disconnect from the gateway",
            group: "Debug",
            ownerOwnly: true,
            hidden: true,
            args: [
                {
                    name: "force",
                    type: "boolean",
                    default: "false",
                },
            ],
        });
    }

    async run(message: Message, [force]: [boolean | "false"]): Promise<void> {
        if (force === "false") force = false;

        // Check if it is safe to shutdown (skip the check if running in force mode)
        if (this.client.voice.connections.size > 0 && !force) {
            // Warn the user
            const embed = new MessageEmbed({
                color: "RANDOM",
                title: "Aborting shutdown...",
                fields: [
                    {
                        name: "Reason:",
                        value: stripIndents`
                            Currently playing audio in ${this.client.voice.connections.size} guild(s)
                        `,
                    },
                ],
            });

            message.channel.send({ embed });
        } else {
            // Shutdown
            message.channel.send("Initiating shutdown...");
            this.client.destroy();
            await this.client.database.disconnect();
            process.exit(0);
        }
    }
}
