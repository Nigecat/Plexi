import { Message } from "discord.js";

export default {
    args: ["limit"],
    perms: ["ADMINISTRATOR"],
    description: "Delete the <limit> most recent messages in the current channel",
    call (message: Message, args: string[]): void {
        const limit: number = Number(args[0]);
        if (!isNaN(limit)) {
            // Max API bulk delete of 100 messages
            if (limit <= 100) {
                message.channel.bulkDelete(limit);
            } else {
                message.channel.send("Purge size must be 100 messages or fewer!");
            }
        } else {
            message.channel.send("Limit must be a number!");
        }
    }
}