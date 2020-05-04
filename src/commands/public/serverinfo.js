let { MessageEmbed } = require("discord.js");

module.exports = {
    args: [],
    perms: [],
    description: "Get the info on this server",
    call: function(message) {
        let embed = new MessageEmbed()
            .setColor([114, 137, 218])
            .setTitle(message.channel.guild.name)
            .setThumbnail (`${message.channel.guild.iconURL()}?size=512`)
            .addField("Server ID", message.guild.id)
            .addField("Region", message.guild.region)
            .addField("Total Members", message.guild.memberCount)
            .addField("You joined", new Date(message.guild.joinedTimestamp).toUTCString())
            .setFooter(`Server created ${new Date(message.guild.createdAt).toUTCString()}`)

        message.channel.send({embed});
    }
}