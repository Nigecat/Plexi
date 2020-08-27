import FileType from "file-type";
import { Plexi } from "../../Plexi";
import { Command } from "../Command";
import { fetchBuf } from "../../utils/misc";
import { Message, User, MessageEmbed } from "discord.js";

export default class ReactionCommand extends Command {
    /**
     * @param {Plexi} client - The client for this command
     * @param {string} nameLower - The lowercase name of this command (e.g 'hug')
     * @param {string} nameUpper - The name of this command with the first letter uppercase (e.g 'Hug')
     * @param {string} namePlural - A plural of this command that will be put into `{user} was <plural> by {user}` (e.g 'hugged')
     */
    constructor(client: Plexi, private nameLower: string, nameUpper: string, private namePlural: string) {
        super(client, {
            name: nameLower,
            description: nameUpper + " someone!",
            group: "Reaction",
            args: [
                {
                    type: "user",
                    name: "user",
                },
            ],
        });
    }

    async run(message: Message, [user]: [User]): Promise<void> {
        message.channel.startTyping();

        const url = `https://emilia-api.xyz/api/${this.nameLower}?apiKey=${process.env.EMILIA_TOKEN}`;

        const image = await fetchBuf(url);

        const { ext } = await FileType.fromBuffer(image);

        const embed = new MessageEmbed({
            color: "RANDOM",
            title: `${user.username} was ${this.namePlural} by ${message.author.username}!`,
        });
        embed.attachFiles([{ name: `image.${ext}`, attachment: image }]);
        embed.setImage(`attachment://image.${ext}`);

        message.channel.send({ embed });

        message.channel.stopTyping();
    }
}
