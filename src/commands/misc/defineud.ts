import { term } from "urban-dictionary";
import { MessageEmbed } from "discord.js";
import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class DefineUD extends Command {
    constructor(client: Client) {
        super(client, {
            name: "defineud",
            memberName: "defineud",
            group: "misc",
            description: "Get the urban dictionary definition of a word",
            args: [
                {
                    key: "word",
                    prompt: "What is the word you want to define?",
                    type: "string",
                    validate: (word: string) => !word.includes(" ")
                }
            ]
        });
    }

    async run(message: CommandoMessage, { word }: { word: string }) {
        message.channel.startTyping();
        
        let result: any = await (async() => {
            return new Promise(resolve => term(word, (err: any, entries: any) => resolve({ err, entries })));
        })();

        message.channel.stopTyping();

        if (result.err) {
            return message.say("Word not found!");
        }
        
        const embed = new MessageEmbed({ 
            title: "Urban dictionary word definition: " + word,
            color: "#0099ff"
        });

        // Remove any definitions greater than the max embed field character limit
        result.entries = result.entries.filter((definition: any) => definition.definition.length <= 1024);

        // Add all the definitions to the embed
        result.entries.forEach((definition: any, i: number) => embed.addField(i + 1, definition.definition));

        return message.embed(embed);
    }
}