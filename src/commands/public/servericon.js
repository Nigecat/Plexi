const Discord = require('discord.js');

module.exports = {
    args: [],
    perms: [],
    description: "Get the server's icon",
    call: function (message) {
        let embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(message.channel.guild.name)
            .setImage(`${message.channel.guild.iconURL()}?size=512`)
            
        message.channel.send({embed});
    }
}