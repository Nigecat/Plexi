import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { Message, User, MessageEmbed } from "discord.js";

export default class Avatar extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "avatar",
            group: "misc",
            description: "Get a user's avatar",
            args: [{ name: "user", type: "user" }],
        });
    }

    run(message: Message, [user]: [User]): void {
        const embed = new MessageEmbed({
            color: "#0099ff",
            title: user.tag,
            image: { url: user.avatarURL({ dynamic: true, format: "png", size: 512 }) },
        });
        message.channel.send({ embed });
    }
}
