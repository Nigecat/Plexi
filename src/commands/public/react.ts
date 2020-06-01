import { Message } from "discord.js";
import { toEmoji, lastMessage } from "../../util/util.js"
import Command from "../../util/Command.js";

export default Command.create({
    args: "text",
    description: "Respond to the previous message with a word in the form of emojis (only supports a-z, duplicate characters won't work)",
    call (message: Message, args: string): void {
        // This prevents the function from returning a Promise which
        // will prevent the bot from being set to typing while this runs
        (async() => {
            const msg: Message = await lastMessage(message.channel);
            toEmoji(args).split(" ").reduce((promise, emoji) => promise.then(() => msg.react(emoji)), Promise.resolve());  
        })(); 
    }
});