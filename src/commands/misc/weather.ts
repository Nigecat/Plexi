import { find } from "weather-js";
import { MessageEmbed } from "discord.js";
import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Weather extends Command {
    constructor(client: Client) {
        super(client, {
            name: "weather",
            memberName: "weather",
            group: "misc",
            description: "Get the weather for the specified city (add c/f to the end to specify the degree type)",
            args: [
                {
                    key: "city",
                    prompt: "Where do you want to get the weather for?",
                    type: "string"
                }
            ]
        });
    }

    async run(message: CommandoMessage, { city }: { city: string }) {
        message.channel.startTyping();
        
        // Check if user included the C/F
        const includedDegrees = city.substr(city.length - 1).toLowerCase() === "c" || city.substr(city.length - 1).toLowerCase() === "f";

        // Extract C/F from input or default to C
        const degreeType = includedDegrees ? city.substr(city.length - 1) : "c";

        // Remove C/F from input trying if user supplied it
        city = includedDegrees ? city.substring(0, city.length - 2) : city;

        const result: any = await (async() => {
            return new Promise(resolve => {
                find({ search: city, degreeType }, (err: any, result: any) => resolve({ err, result }));
            });
        })();

        message.channel.stopTyping();

        if (result.err || result.result.length === 0) {
            return message.say("City not found!");
        }

        const embed = new MessageEmbed({
            color: "#7289da",
            title: `Weather for ${result.result[0].location.name} (${degreeType.toUpperCase()})`,
            thumbnail: { url: result.result[0].current.imageUrl },
            fields: [
                { name: "Current Condition", value: result.result[0].current.skytext, inline: true },
                { name: "Temperature", value: result.result[0].current.temperature, inline: true },
                { name: "Feels Like", value: result.result[0].current.feelslike, inline: true },
                { name: "‎", value: "‎" },
                { name: "Windspeed", value: result.result[0].current.winddisplay, inline: true },
                { name: "Checked On", value: result.result[0].current.day, inline: true }
            ]
        });

        return message.embed(embed);
    }
} 