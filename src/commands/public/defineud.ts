import { Message } from "discord.js";
import ud from "urban-dictionary";
import Command from "../../util/Command.js";

export default <Command> {
    args: "word",
    description: "Get the definition of a word (or phrase)",
    call (message: Message, args: string): void {
        ud.term(args, (err: any, entries: any, tags: any, sounds: any) => {
            if (err) {
                message.channel.send("Word not found");
            } else {
                message.channel.send(`**Urban dictionary definition:**\n**Word:** ${entries[0].word}\n**Definition:** ${entries[0].definition}\n**Example:** ${entries[0].example}`);
            }
        });
    }
}