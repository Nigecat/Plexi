const Discord = require('discord.js');

module.exports = {
    args: ["<@user>"],
    description: "Get a user's avatar",
    call: function (message) {
        let embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(message.mentions.users.first().tag)
            .setImage(`${message.mentions.users.first().displayAvatarURL()}?size=512`)
            
        message.channel.send({embed});
    }
}