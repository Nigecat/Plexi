import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { stripIndents } from "common-tags";

export default class CreateEmoji extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "create-emoji",
            group: "Moderation",
            description: "Create a new emoji in this server",
            userPermissions: ["MANAGE_EMOJIS"],
            clientPermissions: ["MANAGE_EMOJIS"],
            guildOnly: true,
            args: [
                {
                    name: "emojiName",
                    type: "string",
                },
                {
                    name: "imageURL",
                    type: "string",
                },
            ],
        });
    }

    async run(message: Message, [name, url]: [string, string]): Promise<void> {
        try {
            const emoji = await message.guild.emojis.create(url, name);
            message.channel.send(`Emoji created! ${emoji}`);
        } catch {
            message.channel.send(stripIndents`
                I was unable to create that emoji. Some of the common issues with this are:
                - The image is too large
                - That emoji already exists
                - The url is invalid
            `);
        }
    }
}
