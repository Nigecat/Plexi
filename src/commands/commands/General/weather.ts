import { promisify } from "util";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { find, WeatherData } from "weather-js";
import { Message, MessageEmbed } from "discord.js";

export default class Weather extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "weather",
            group: "General",
            description: "Get the weather for the specified city (add c/f to the end to specify the degree type)",
            args: [
                {
                    name: "city",
                    type: "string",
                    infinite: true,
                },
            ],
        });
        this.format = "[city] <c/f>";
    }

    async run(message: Message, [city]: [string]): Promise<void> {
        // Check if user included the C/F
        const includedDegrees =
            city.substr(city.length - 1).toUpperCase() === "C" || city.substr(city.length - 1).toUpperCase() === "F";

        // Extract C/F from input or default to C
        const degreeType = (<unknown>(includedDegrees ? city.substr(city.length - 1).toUpperCase() : "C")) as "C" | "F";

        // Remove C/F from input trying if user supplied it
        city = includedDegrees ? city.substring(0, city.length - 2) : city;

        const result = await message.channel.send(`Finding weather for city: \`${city}\`...`);

        let weather: WeatherData[];

        try {
            weather = await promisify(find)({ search: city, degreeType });
        } catch {
            result.edit("City not found!");
            return;
        }

        // If we did not get a result
        if (!weather[0]) {
            result.edit("City not found!");
            return;
        }

        const embed = new MessageEmbed({
            color: "#7289da",
            title: `Weather for ${weather[0].location.name} (${degreeType.toUpperCase()})`,
            thumbnail: { url: weather[0].current.imageUrl },
            fields: [
                {
                    name: "Current Condition",
                    value: `${weather[0].current.skytext}`,
                    inline: true,
                },
                {
                    name: "Temperature",
                    value: `${weather[0].current.temperature} °${degreeType.toUpperCase()}`,
                    inline: true,
                },
                {
                    name: "Feels Like",
                    value: `${weather[0].current.feelslike} °${degreeType.toUpperCase()}`,
                    inline: true,
                },
                { name: "‎", value: "‎" },
                {
                    name: "Windspeed",
                    value: `${weather[0].current.winddisplay}`,
                    inline: true,
                },
                {
                    name: "Checked On",
                    value: `${weather[0].current.day}`,
                    inline: true,
                },
            ],
        });

        result.edit("", { embed });
    }
}
