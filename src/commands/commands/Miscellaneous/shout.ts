import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import emojify from "../../../assets/json/emojify.json";

export default class Shout extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "shout",
            group: "Miscellaneous",
            description: "🇸 🇭 🇴 🇺 🇹    🇹 🇭 🇪    🇸 🇺 🇵 🇵 🇱 🇮 🇪 🇩    🇹 🇪 🇽 🇹 ❗",
            args: [
                {
                    name: "text",
                    type: "string",
                    infinite: true,
                },
            ],
        });
    }

    run(message: Message, [text]: [string]): void {
        // We also make any spaces three times larger to make it easier to read
        const out = [...text].map((char) => (char === " " ? "   " : emojify[char] || char + " "));
        message.channel.send(out.join(" "));
    }
}
