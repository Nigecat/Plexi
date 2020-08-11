import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { version } from "../../../../package.json";
import { Message, MessageEmbed, TextChannel, VoiceChannel } from "discord.js";

export default class Feedback extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "feedback",
            description: "Want to give feedback? Encountered any bugs? Have a suggestion?",
            group: "General",
            args: [
                {
                    name: "text",
                    type: "string",
                    infinite: true,
                },
            ],
        });
    }

    async run(message: Message, [text]: [string]): Promise<void> {
        const embed = new MessageEmbed({
            color: "RANDOM",
            footer: { text: `v${version}` },
            title: `Feedback command used by ${message.author.tag}`,
            fields: [
                {
                    name: "In:",
                    value: message.guild
                        ? `${message.guild.name}, ${
                              ((message.channel as unknown) as TextChannel | VoiceChannel).name
                          } (${message.channel.id})`
                        : `DM`,
                },
                {
                    name: "Content:",
                    value: text,
                },
            ],
        });

        await this.client.users.cache.get(this.client.config.owner).send({ embed });
        await message.react("🇸");
        await message.react("🇪");
        await message.react("🇳");
        await message.react("🇹");
    }
}
