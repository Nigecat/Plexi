import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { stripIndents } from "common-tags";

export default class Eval extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "eval",
            group: "Util",
            ownerOwnly: true,
            hidden: true,
            description: "Execute raw javascript",
            args: [
                {
                    name: "script",
                    type: "string",
                    infinite: true,
                },
            ],
        });
    }

    async run(message: Message, [script]: [string]): Promise<void> {
        // Create helper variables
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const client = this.client;

        try {
            const hrStart = process.hrtime();
            const result = await eval(script);
            const hrDiff = process.hrtime(hrStart);
            message.channel.send(stripIndents`
                Executed in ${hrDiff[1]}ms: 
                \`\`\`
                ${result}
                \`\`\`
            `);
        } catch (err) {
            message.channel.send(`Error while evaluating: \`${err}\``);
        }
    }
}
