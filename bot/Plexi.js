const ytdl = require('ytdl-core');
const Discord = require('discord.js');
const client = new Discord.Client();
const TOKEN = "NjIxMTc5Mjg5NDkxOTk2Njgz.XXhmFw.IgagFyMii9zzY8gRAZBTPHxTkDU";
const PREFIX = "$";

client.on('ready', () => {
    console.log("Servers:");
    client.guilds.forEach((guild) => {
        console.log("\n - " + guild.name);
        guild.members.forEach((member) => {
            console.log(`   -- ${member.displayName}: ${member.user.tag}`);
        });
    });

    client.user.setActivity("your soul", {type: "WATCHING"});
    console.log(`\n\nConnected as ${client.user.tag}\n`);
});

client.on('message', async message => {
    if (message.author != client.user && message.content.startsWith(PREFIX)) {
        console.log("Command received: " + message.content);

        let command = message.content.split(PREFIX).slice(1).join(PREFIX).toLowerCase().split(" ")[0];    // remove token from string
        let args = message.content.split(" ").slice(1);

        switch (command) {
            case "help": {
                let embed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Plexi')
                    .setDescription('this entire project was a bad idea...\nCommands:')
                    .setThumbnail('https://cdn.discordapp.com/avatars/621179289491996683/9746eaab6605b25c429b3d1459d172a6.png?size=128')
                    .addField('$whatsmypeanut', '‎')
                    .addField('$whatstheirpeanut <@user>', '‎')
                    .addField('$bruh\t$sec\t$mop\t$naeg', '‎')
                    .addField('$play <url>', 'Play a video from a url (youtube is supported)')
                    .setTimestamp()
                message.channel.send({embed});
                break;
            }

            case "whatsmypeanut": {
                message.channel.send(`Your peanut meter level is currently at ${peanut(message.author.id, message.guild.id)}!`);
                message.channel.send("`Calculated with peanut algorithm™`");
                break;
            }

            case "whatstheirpeanut": {
                message.channel.send(`${message.mentions.users.first()}'s peanut meter level is currently at ${peanut(message.guild.members.get(args[0].split("@")[1].split(">")[0]).id, message.guild.id)}`);
                message.channel.send("`Calculated with peanut algorithm™`");
                break;
            }

            case "bruh": {
                await playAudio(message, "bruh.mp3", "local", 1);
                break;
            }

            case "mop": {
                await playAudio(message, "mop.mp3", "local", 1);
                break;
            }            
            
            case "sec": {
                await playAudio(message, "sec.mp3", "local", 1);
                break;
            }

            case "naeg": {
                await playAudio(message, "naeg.mp3", "local", 2);
                break;
            }

            case "play": {
                await playAudio(message, args[0], "online", 1);
                break;
            }

            case "download": {
                // TODO
            }
        }
    }
});

client.login(TOKEN);







/**
 * 
 * @param {string} message user's message object
 * @param {string} source source location for audio to play, can be web url or local file
 * @param {string} location online/local
 * @param {number} volume 1 = 100%
 */
async function playAudio(message, source, location, volume) {
    if (message.member.voice.channel) {
        message.delete();
        message.member.voice.channel.join()
            .then(connection => { 
                if (location == "local") {
                    const dispatcher = connection.play(`${__dirname}/sound/${source}`, {
                        volume: volume
                    });
                    dispatcher.on('end', () => {
                        dispatcher.destroy();
                        connection.disconnect();
                    });

                } else if (location == "online") {
                    const dispatcher = connection.play(ytdl(source, {
                        filter: 'audioonly' 
                    }), {
                        volume: volume
                    });
                    dispatcher.on('end', () => {
                        dispatcher.destroy();
                        connection.disconnect();
                    });
                }
            })
            .catch(console.log);
    } else {
        message.reply('You need to join a voice channel first!');
    }
}

/**
 * 
 * @param {number} userID the user's id
 * @param {number} guildID the message's guild id
 */
function peanut(userID, guildID) {
    return (
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
            parseInt(
                guildID.split("")[0]
            ) * userID.split("")
                    .reduce(
                        (a, b) => parseInt(a) + parseInt(b), 0
                    )
        )
    ) / 10;
}