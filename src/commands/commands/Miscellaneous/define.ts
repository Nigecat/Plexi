import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { getDef } from "word-definition";
import { stripIndents } from "common-tags";

export default class Define extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "define",
            group: "Miscellaneous",
            description: "Get the dictionary definition of a word",
            args: [
                {
                    name: "word",
                    type: "string",
                    validator: (word: string) => !word.includes(" "),
                },
            ],
        });
    }

    async run(message: Message, [word]: [string]): Promise<void> {
        const result = await message.channel.send(`Searching for word: \`${word}\`...`);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const definition: any = await new Promise((resolve) => getDef(word, "en", null, resolve));

        if (definition.definition) {
            result.edit(stripIndents`
                **Word:** ${definition.word}
                **Category:** ${definition.category}
                **Definition:** ${definition.definition}
            `);
        } else {
            result.edit("Word not found!");
        }
    }
}
