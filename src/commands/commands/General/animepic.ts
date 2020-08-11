import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { fetchReddit } from "../../../utils/misc";
import { Message, MessageEmbed } from "discord.js";

export default class AnimePic extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "animepic",
            group: "General",
            description: "Get a random anime pic",
        });
    }

    async run(message: Message): Promise<void> {
        const url = await fetchReddit("awwnime");
        const embed = new MessageEmbed({
            color: "RANDOM",
            image: { url },
        });

        message.channel.send({ embed });
    }
}
