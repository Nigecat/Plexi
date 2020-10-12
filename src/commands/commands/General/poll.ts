import { oneLine } from "common-tags";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { convertMs } from "../../../utils/misc";
import { Message, MessageEmbed } from "discord.js";

export default class Poll extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "poll",
            group: "General",
            guildOnly: true,
            description: oneLine`
                Starts a yes/no poll in the current text channel asking users to vote with the specified time. 
                Time must be a single word in human readable format (e.g 10minutes).
            `,
            args: [
                {
                    name: "time",
                    type: "string",
                    validate: (time: string) => convertMs(time) !== undefined,
                },
                {
                    name: "question",
                    type: "string",
                    infinite: true,
                },
            ],
        });
    }

    async run(message: Message, [time, question]: [string, string]): Promise<void> {
        // Don't allow polls over 24 hours
        if (convertMs(time) > convertMs("24hours")) {
            message.channel.send("You can't make a poll greater than 24 hours in length!");
            return;
        }

        const embed = new MessageEmbed({
            color: "RANDOM",
            description: question,
            author: { name: "Poll Start" },
            footer: { text: `Poll created by ${message.author.username}` },
        });

        let poll = await message.channel.send({ embed });

        await poll.react("✅");
        await poll.react("❌");

        setTimeout(async () => {
            poll = await message.channel.messages.fetch(poll.id);
            const upVotes = poll.reactions.cache.find((emoji) => emoji.emoji.name === "✅").count - 1;
            const downVotes = poll.reactions.cache.find((emoji) => emoji.emoji.name === "❌").count - 1;
            poll.reactions.removeAll();
            const resultEmbed = new MessageEmbed({
                color: "RANDOM",
                description: question,
                author: { name: `Poll over after ${time}` },
                footer: { text: `Poll created by ${message.author.username}` },
                fields: [
                    {
                        name: "✅",
                        value: upVotes,
                        inline: true,
                    },
                    {
                        name: "❌",
                        value: downVotes,
                        inline: true,
                    },
                ],
            });
            poll.edit({ embed: resultEmbed });
        }, convertMs(time));
    }
}
