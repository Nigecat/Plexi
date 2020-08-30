import FileType from "file-type";
import { Plexi } from "../../Plexi";
import { Command } from "../Command";
import { fetchBuf } from "../../utils/misc";
import { Message, User, MessageEmbed } from "discord.js";

export default class ReactionCommand extends Command {
    /**
     * @param client - The client for this command
     * @param nameLower - The lowercase name of this command (e.g 'hug')
     * @param nameUpper - The name of this command with the first letter uppercase (e.g 'Hug')
     * @param namePlural - A plural of this command that will be put into `{user} was <plural> by {user}` (e.g 'hugged') or `${user} <plural> themselves. For a self command it is `${user} is <plural>
     * @param self - Whether this command can be used on another user (false is yes)
     * @param ex - Whether to use a ! after the message for a self command
     * @param nsfw - Whether this reaction should be nsfw gated
     */
    constructor(
        client: Plexi,
        private nameLower: string,
        nameUpper: string,
        private namePlural: string,
        private self = false,
        private ex = true,
        private nsfw = false,
    ) {
        super(client, {
            name: nameLower,
            description: self ? `It's literally the name of the command` : `${nameUpper} someone!`,
            group: "Reaction",
            nsfw: nsfw,
            args: self
                ? []
                : [
                      {
                          type: "user",
                          name: "user",
                      },
                  ],
        });
    }

    async run(message: Message, [user]: [User]): Promise<void> {
        message.channel.startTyping();

        try {
            const url = `https://emilia-api.xyz/api/${this.nameLower}?apiKey=${process.env.EMILIA_TOKEN}`;

            const image = await fetchBuf(url);

            const { ext } = await FileType.fromBuffer(image);

            const title = this.self
                ? `${message.author.username} is ${this.namePlural}${this.ex ? "!" : "..."}`
                : message.author.id === user.id
                ? `${user.username} ${this.namePlural} themselves!`
                : `${user.username} was ${this.namePlural} by ${message.author.username}!`;

            const embed = new MessageEmbed({
                color: "RANDOM",
                title,
            });
            embed.attachFiles([{ name: `image.${ext}`, attachment: image }]);
            embed.setImage(`attachment://image.${ext}`);

            message.channel.send({ embed });
        } catch (err) {
            this.client.emit("error", err);
            message.channel.send(
                "Oops! It appears something went wrong and I couldn't fetch that image, maybe try running the command again?",
            );
        } finally {
            message.channel.stopTyping();
        }
    }
}
