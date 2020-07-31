import { Command } from "plexi/command";
import { PlexiClient } from "plexi/client";
import { Message, User, MessageEmbed } from "discord.js";

export default class Avatar extends Command {
    constructor(client: PlexiClient) {
        super(client, {
            name: "avatar",
            description: "Get the mentioned user's avatar",
            args: [
                {
                    key: "user",
                    type: "user"
                }
            ]
        });
    }

    run(message: Message, { user }: { user: User }) {
        const embed = new MessageEmbed({
            color: "#0099ff",
            title: user.tag,
            image: { url: user.avatarURL({ dynamic: true, format: "png", size: 512 }) }
        });

        return message.channel.send({ embed });
    }
}