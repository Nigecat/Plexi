import { Message } from "discord.js";
import wd from "word-definition";
import Command from "../../util/Command.js";

export default <Command> {
    args: ["word"],
    description: "Get the definition of a word",
    call (message: Message, args: string[]): void {
        wd.getDef(args[0], "en", null, (definition: any) => {
            message.channel.send(`**Word:** ${definition.word}\n**Category:** ${definition.category}\n**Definition:** ${definition.definition}`);
        });
    }
}