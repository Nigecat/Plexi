import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { stripIndents } from "common-tags";
import { getDef, WordDefinition } from "word-definition";

export default class Define extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "define",
            group: "General",
            description: "Get the dictionary definition of a word",
            args: [
                {
                    name: "word",
                    type: "string",
                    validate: (word: string) => !word.includes(" "),
                },
            ],
        });
    }

    async run(message: Message, [word]: [string]): Promise<void> {
        const result = await message.channel.send(`Searching for word: \`${word}\`...`);

        const definition: WordDefinition = await new Promise((resolve) => getDef(word, "en", null, resolve));

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
