import { Plexi } from "../Plexi";
import { Message } from "discord.js";

// If someone does /tableflip respond with /unflip
export default function (client: Plexi): void {
    client.on("message", async (message: Message) => {
        // Ignore bot messages
        if (message.author.bot) return;

        if (message.content.endsWith("(╯°□°）╯︵ ┻━┻")) {
            message.channel.send("┬─┬ ノ(¬_¬ノ)");
        }
    });
}
