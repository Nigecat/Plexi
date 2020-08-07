import { inspect } from "util";
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
            // eslint-disable-next-line no-eval
            const result = await eval(script);
            const hrDiff = process.hrtime(hrStart);
            message.channel.send(
                stripIndents`
                Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ""}${hrDiff[1] / 1000000}ms:
                \`\`\`javascript
                ${inspect(result, { depth: 0, breakLength: 4 }).replace(this.client.token, "--snip--")}
                \`\`\`
            `,
                {
                    split: {
                        prepend: "```javascript\n",
                        append: "\n```",
                    },
                },
            );
        } catch (err) {
            message.channel.send(`Error while evaluating: \`${err}\``);
        }
    }
}
