const weather = require('weather-js');
const { MessageEmbed } = require("discord.js");

module.exports = {
    args: "[region] <c/f>",
    perms: [],
    description: "Get the weather for the specified region (city)",
    call: function(message, args) {
        let region = args.join(" ");
        if (region.substr(region.length - 1).toLowerCase() == "c" || region.substr(region.length - 1).toLowerCase() == "f") {
            var type = region.substr(region.length - 1);
            region = region.substring(0, region.length - 2);
        } else {
            var type = "c";
        }

        weather.find({search: region, degreeType: type}, function(err, result) {
            if (result.length > 0) {
                let embed = new MessageEmbed()
                    .setColor([114, 137, 218])
                    .setTitle(`Weather for ${result[0].location.name}`)
                    .addField("Current Condition", result[0].current.skytext, true)
                    .addField("Temperature", `${result[0].current.temperature} °${result[0].location.degreetype}`, true)
                    .addField("Feels like", `${result[0].current.feelslike} °${result[0].location.degreetype}`, true)
                    .addField("‎", "‎")
                    .addField("Windspeed", result[0].current.winddisplay, true)
                    .addField("Humidity", `${result[0].current.humidity}%`, true)
                    .addField("Checked on", `${result[0].current.day} @ ${result[0].current.observationtime}`, true)
                    .setThumbnail(result[0].current.imageUrl);
            
                message.channel.send({embed});
            } else {
                message.channel.send("Region not found!");
            }
        });
    }
}