import { Message, MessageEmbed } from "discord.js";
import weather from "weather-js";
import Command from "../../util/Command.js";

export default <Command> {
    args: "<region> <c/f>",
    description: "Get the weather for the specified region (city)",
    call (message: Message, args: string): void {
        let region: string = args;

        // Check if user included the C/F
        const includedDegrees = region.substr(region.length - 1).toLowerCase() === "c" || region.substr(region.length - 1).toLowerCase() === "f";
        
        // Extract C/F from input or default to C
        const type = includedDegrees ? region.substr(region.length - 1) : "c";

        // Remove C/F from input trying if user supplied it
        region = includedDegrees ? region.substring(0, region.length - 2) : region;

        weather.find({ search: region, degreeType: type }, (err: any, result: any) => {
           if (result.length > 0) {
                const embed: MessageEmbed = new MessageEmbed()
                    .setColor("#7289DA")
                    .setTitle(`Weather for ${result[0].location.name}`)
                    .addField("Current Condition", result[0].current.skytext, true)
                    .addField("Temperature", `${result[0].current.temperature} °${result[0].location.degreetype}`, true)
                    .addField("Feels like", `${result[0].current.feelslike} °${result[0].location.degreetype}`, true)
                    .addField("‎", "‎")
                    .addField("Windspeed", result[0].current.winddisplay, true)
                    .addField("Humidity", `${result[0].current.humidity}%`, true)
                    .addField("Checked on", `${result[0].current.day} @ ${result[0].current.observationtime}`, true)
                    .setThumbnail(result[0].current.imageUrl);
        
                message.channel.send({ embed });
           } else {
                message.channel.send("Region not found!");
           }
        });
    }
}