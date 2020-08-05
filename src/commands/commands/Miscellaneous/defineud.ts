import querystring from "querystring";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { fetch } from "../../../utils/misc";
import { Message, MessageEmbed } from "discord.js";

export default class DefineUD extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "defineud",
            group: "Miscellaneous",
            description: "Get the urban dictionary definition of a word",
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

        let definitions: WordDefinition[];

        try {
            definitions = await this.getDefinitions(word);
        } catch {
            result.edit("Word not found!");
            return;
        }

        const embed = new MessageEmbed({
            title: `Urban dictionary word definition: ${word}`,
            color: "#0099ff",
        });

        // Remove any definitions greater than the max embed field character limit
        definitions = definitions.filter((definition: WordDefinition) => definition.definition.length <= 1024);

        // Add all the definitions to the embed
        definitions.forEach((definition: WordDefinition, i: number) => embed.addField(i + 1, definition.definition));

        result.edit("", { embed });
    }

    async getDefinitions(term: string): Promise<WordDefinition[]> {
        const query = querystring.stringify({ term });
        const result = await fetch(`https://api.urbandictionary.com/v0/define?${query}`);

        if (!result.list[0]) {
            throw new Error(`${term} is undefined.`);
        }

        return result.list;
    }
}

interface WordDefinition {
    definition: string;
    permalink: string;
    thumbs_up: number;
    thumbs_down: number;
    sound_urls: string[];
    author: string;
    word: string;
    defid: number;
    current_vote: string;
    written_on: string;
    example: string;
}
