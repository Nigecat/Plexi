const ytdl = require('ytdl-core');
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
    },
    play: {
        call: play,
        description: "Play a YouTube video",
        args: ["<url>"]
    },
    local: {
        call: local,
        description: "bruh",
        args: ["[bruh | mop | naeg | sec]"]
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

function play(message, args) {
    playAudio(message, args[0], false);
}

function local(message, args) {
    playAudio(message, args[0], true)
}









function playAudio(message, file, local) {
    file = local ? `${__dirname}/audio/${file}.mp3` : ytdl(file, { filter: "audioonly" });
    try {
        let vc = message.member.voice.channel;
        vc.join().then(connection => {
            const dispatcher = connection.play(file);
            dispatcher.on('end', () => { vc.leave() });
        });
    } catch (err) {
        message.channel.send("Please connect to a voice channel!")
    }
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