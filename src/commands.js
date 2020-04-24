const Discord = require('discord.js');

module.exports = {
    whatsmypeanut: {
        call: whatsmypeanut,
        description: "Check your own peanut level",
        args: []
    },
    whatstheirpeanut: {
        call: whatstheirpeanut,
        description: "Check a user's peanut level",
        args: ["<@user>"]
    },
    avatar: {
        call: avatar,
        description: "Get a user's avatar (profile picture)",
        args: ["<@user>"]
    },
    servericon: {
        call: servericon,
        description: "Get the current server's icon",
        args: []
    }
}




function whatsmypeanut(message) {
    checkPeanut(message.author.id, message.guild, level => {
        message.channel.send(`Your peanut meter level is currently at ${level}!`);
        message.channel.send("`Calculated with peanut algorithm™`");
    });
}

function whatstheirpeanut(message) {
    checkPeanut(message.mentions.members.first().id, message.guild, level => {
        message.channel.send(`${message.mentions.users.first()}'s peanut meter level is currently at ${level}`);
        message.channel.send("`Calculated with peanut algorithm™`");
    });
}

function avatar(message) {
    let embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(message.mentions.users.first().tag)
        .setImage(`${message.mentions.users.first().displayAvatarURL()}?size=512`)
        
    message.channel.send({embed});
}

function servericon(message) {
    let embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(message.channel.guild.name)
        .setImage(`${message.channel.guild.iconURL()}?size=512`)
        
    message.channel.send({embed});
}













function checkPeanut(userID, guild, callback) {
    callback((
        (
            (
                parseInt(userID.split("")[0]) + 1
            ) * (
                parseInt(userID.split("")[1]) + 1
            ) * (
                parseInt(userID.split("")[2]) + 1
            ) * (
                parseInt(userID.split("")[3]) + 1)
        ) / 10 + (
            parseInt(guild.id.split("")[0]) * userID.split("")
                .reduce((a, b) => parseInt(a) + parseInt(b), 0)
        )
    ) / 10);
}