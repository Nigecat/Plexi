import { Message, User } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { sendBufApi } from "../../../utils/misc";

export default class Achievement extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "kyongun",
            group: "Generator",
            description: "Draw someones profile picture in front of Kyon shooting a gun.",
            args: [
                {
                    name: "user",
                    type: "user",
                },
            ],
        });
    }

    run(message: Message, [user]: [User]): void {
        const url = `https://emilia-api.xyz/api/kyon-gun?apiKey=${process.env.EMILIA_TOKEN}&image=${user.avatarURL({
            format: "png",
            size: 512,
        })}`;
        sendBufApi(url, message.channel);
    }
}
