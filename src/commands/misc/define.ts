import { getDef } from "word-definition";
import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Define extends Command {
    constructor(client: Client) {
        super(client, {
            name: "define",
            memberName: "define",
            description: "Get the definition of a word",
            group: "misc",
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

        const definition: any = await (async() => {
            return new Promise(resolve => getDef(word, "en", null, resolve));
        })();

        message.channel.stopTyping();

        if (definition.definition == undefined) {
            return message.say("Word not found!");
        } else {
            return message.say(`**Word:** ${definition.word}\n**Category:** ${definition.category}\n**Definition:** ${definition.definition}`);
        }
    }
}