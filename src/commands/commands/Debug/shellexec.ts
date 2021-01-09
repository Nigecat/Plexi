import { exec } from "child_process";
import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { stripIndents } from "common-tags";

export default class ShellExec extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "shellexec",
            group: "Debug",
            ownerOwnly: true,
            hidden: true,
            description: "Execute a shell command",
            args: [
                {
                    name: "command",
                    type: "string",
                    infinite: true,
                },
            ],
        });
    }

    async run(message: Message, [command]: [string]): Promise<void> {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                message.channel.send(stripIndents`
                    An error occured while attempting execution:
                    \`\`\`
                    ${error}
                    \`\`\`
                `);
            }

            if (stderr) {
                message.channel.send(stripIndents`
                    An error occured during execution:
                    \`\`\`
                    ${error}
                    \`\`\`
                `);
            }

            if (stdout) {
                message.channel.send(stripIndents`
                    Execution finished with result:
                    \`\`\`
                    ${stdout}
                    \`\`\`
                `);
            } else {
                message.react("✅");
            }
        });
    }
}
