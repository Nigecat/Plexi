import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { fetchReddit } from "../../../utils/misc";
import { Message, MessageEmbed } from "discord.js";

export default class Awwnime extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "awwnime",
            group: "Anime",
            description: "Cute anime girls!",
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
