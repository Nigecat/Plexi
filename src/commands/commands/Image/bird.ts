import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { fetch } from "../../../utils/misc";

export default class Bird extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "bird",
            group: "Image",
            description: "Get a random bird image",
        });
    }

    async run(message: Message): Promise<void> {
        const res = await fetch("https://shibe.online/api/birds?count=1&urls=true&httpsUrls=true");
        message.channel.send({ files: [res[0]] });
    }
}
