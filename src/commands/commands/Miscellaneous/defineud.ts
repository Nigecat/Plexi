import { promisify } from "util";
import { Plexi } from "../../../Plexi";
import { term } from "urban-dictionary";
import { Command } from "../../Command";
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let definitions: any;

        try {
            definitions = await promisify(term)(word);
        } catch {
            result.edit("Word not found!");
            return;
        }

        const embed = new MessageEmbed({
            title: `Urban dictionary word definition: ${word}`,
            color: "#0099ff",
        });

        // Remove any definitions greater than the max embed field character limit
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        definitions = definitions.filter((definition: any) => definition.definition.length <= 1024);

        // Add all the definitions to the embed
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        definitions.forEach((definition: any, i: number) => embed.addField(i + 1, definition.definition));

        result.edit("", { embed });
    }
}
