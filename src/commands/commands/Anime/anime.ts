import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { stripIndents } from "common-tags";
import { fetch } from "../../../utils/misc";
import { Message, MessageEmbed } from "discord.js";

export default class Anime extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "anime",
            group: "Anime",
            description: "Searches for an anime on Kitsu.io",
            args: [
                {
                    name: "anime",
                    type: "string",
                    infinite: true,
                },
            ],
        });
    }

    async run(message: Message, [search]: [string]): Promise<void> {
        const result = await message.channel.send(`Searching for anime: ${search}`);

        const res = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURI(search)}`);

        // Cancel if we did not get any results
        if (res.data.length === 0) {
            result.edit("Show not found!");
            return;
        }

        const anime = res.data[0].attributes;

        const embed = new MessageEmbed({
            color: "RANDOM",
            description: anime.synopsis.replace(/<[^>]*>/g, "").split("\n")[0],
            image: { url: anime.posterImage.original },
            author: {
                name: `${anime.titles.english ? anime.titles.english : search} | ${anime.showType}`,
                iconURL: anime.posterImage.original,
            },
            fields: [
                {
                    name: "❯ Information",
                    inline: true,
                    value: stripIndents`
                        • **Name:** ${anime.titles.romaji || anime.titles.en_jp}
                        • **Age Rating:** ${anime.ageRating}
                        • **NSFW:** ${anime.nsfw ? "Yes" : "No"}
                    `,
                },
                {
                    name: "❯ Stats",
                    inline: true,
                    value: stripIndents`
                        • **Average Rating:** ${anime.averageRating}
                        • **Rating Rank:** ${anime.ratingRank}
                        • **Popularity Rank:** ${anime.popularityRank}
                    `,
                },
                {
                    name: "❯ Status",
                    inline: true,
                    value: stripIndents`
                        • **Episodes:** ${anime.episodeCount ? anime.episodeCount : "N/A"}
                        • **Start Date:** ${anime.startDate}
                        • **End Date:** ${anime.endDate ? anime.endDate : "Still airing"}
                    `,
                },
            ],
        });

        result.edit({ embed });
    }
}
