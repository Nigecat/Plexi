import { Command } from "../../Command";
import { Plexi } from "../../../Plexi";
import { Message } from "discord.js";
import { lastMessage } from "../../../utils/misc";

export default class Brr extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "brr",
            description: "Add 'go brrrrrrrrrrrrrrrrrrrrrrrrrr' to the end of the previous message",
            group: "Fun",
        });
    }

    async run(message: Message): Promise<void> {
        const msg = await lastMessage(message.channel);
        message.channel.send(`${msg.content} go brrrrrrrrrrrrrrrrrrrrrrrrrr`);
    }
}
