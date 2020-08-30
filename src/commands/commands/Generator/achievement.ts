import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { sendBufApi } from "../../../utils/misc";

export default class Achievement extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "achievement",
            group: "Generator",
            description: "Sends a achievement with the text of your choice",
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
        const url = `https://emilia-api.xyz/api/achievement?apiKey=${process.env.EMILIA_TOKEN}&text=${encodeURI(
            text,
        )}&image=${message.author.avatarURL({ format: "png" })}`;
        sendBufApi(url, message.channel);
    }
}
