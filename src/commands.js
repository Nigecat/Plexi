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
    flex: {
        call: flex,
        description: "Flex on the previous message",
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

function flex(message) {
    message.channel.messages.fetch({ limit: 2 }).then(messages => {
        let message = messages.array()[1];
        message.guild.emojis.forEach(emoji => {
            if (emoji.identifier.toLowerCase().includes("nitroflex")) {
                message.react(emoji);
            }
        });
    });
}