import { Plexi } from "../Plexi";
import { Message } from "discord.js";

/** Custom code for 264163117078937601 (Pinpointpotato#9418) AKA the ideas man */
export default function (client: Plexi): void {
    client.on("message", (message: Message) => {
        // Ignore bot messages
        if (message.author.bot) return;

        if (
            message.author.id === "264163117078937601" &&
            message.content.toLowerCase().includes("you know why they call me the ideas man")
        ) {
            message.channel.send("cuz i CLEEEEEEAaaan up");
        }
    });
}
