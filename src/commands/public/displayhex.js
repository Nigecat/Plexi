const { MessageEmbed } = require("discord.js");

module.exports = {
    args: ["<hex-code>"],
    perms: [],
    description: "Display a hex code",
    call: function(message, args) {
        if (!args[0].startsWith("#")) {
            args[0] = `#${args[0]}`
        }
        if (args[0].length != 7) {
            message.channel.send("Invalid hex code");
        } else {
            let embed = new MessageEmbed()
                .setColor(args[0])
                .setTitle(args[0])
                .setImage(`https://www.colorhexa.com/${args[0].split("#")[1]}.png`);

             message.channel.send({embed});  
        }
    }
}