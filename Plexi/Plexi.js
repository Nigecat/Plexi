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

        /**
         * @
         */
        switch (command) {
            case "help": {
                let embed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Plexi')
                    .setDescription('this entire project was a bad idea...')
                    .addBlankField()
                    .setThumbnail('https://cdn.discordapp.com/avatars/621179289491996683/9746eaab6605b25c429b3d1459d172a6.png?size=128')
                    .addField('$whatsmypeanut\t\t$whatstheirpeanut <@user>', '‎')
                    .addField('$bruh\t\t$sec\t\t$mop\t\t$naeg\t\t$play <url>', '‎')
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
                message.channel.send(`${message.mentions.users.first()}'s peanut meter level is currently at ${peanut(args[0].split("@!")[1].split(">")[0], message.guild.id)}`);
                message.channel.send("`Calculated with peanut algorithm™`");
                break;
            }

            case "bruh": {
                this.player = new audioPlayer(message, "bruh.mp3", "local", 2, true);
                this.player.play();
                break;
            }

            case "mop": {
                this.player = new audioPlayer(message, "mop.mp3", "local", 1, true);
                this.player.play();
                break;
            }            
            
            case "sec": {
                this.player = new audioPlayer(message, "sec.mp3", "local", 1, true);
                this.player.play();
                break;
            }

            case "naeg": {
                this.player = new audioPlayer(message, "naeg.mp3", "local", 2, true);
                this.player.play();
                break;
            }

            case "p":
            case "play": {
                this.player = new audioPlayer(message, args[0], "online", 1, false);
                this.player.play();
                break;
            }

            case "pause": {
                this.player.pause();
                break;
            }

            case "resume": {
                this.player.resume();
                break;
            }

            case "stop":
            case "leave":
            case "disconnect": {
                this.player.leave();
                break;
            }

            case "download": {
                // TODO
            }
        }
    }
});

client.login(TOKEN);





class audioPlayer {
    /**
     * @class 
     * @param {object}  message     user's message object
     * @param {string}  source      source location for audio to play, can be web url or local file
     * @param {string}  location    online/local
     * @param {number}  volume      1 = 100%
     * @param {boolean} disconnect  whether or not to diconnect after audio is finished playing
     */
    constructor(message, source, location, volume, disconnect) {
        this.message = message;
        this.source = source;
        this.location = location;
        this.volume = volume;
        this.disconnect = disconnect;

        this.connection;
        this.dispatcher;
    }

    
    play() {
        if (this.message.member.voice.channel) {
            this.message.delete();
            this.message.member.voice.channel.join()
                .then(connection => { 
                    this.connection = connection;

                    if (this.location == "local") {
                        this.dispatcher = this.connection.play(`${__dirname}/sound/${this.source}`, {
                            volume: this.volume
                        });
                    } else if (this.location == "online") {
                        this.dispatcher = this.connection.play(ytdl(this.source, {
                            filter: 'audioonly' 
                        }), {
                            volume: this.volume
                        });
                    }
                    if (this.diconnect) {
                        this.dispatcher.on('end', () => {
                            this.dispatcher.destroy();
                            this.connection.disconnect();
                        });
                    }
                })
                .catch(console.log);
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }

    pause() {
        this.dispatcher.pause();
    }

    resume() {
        this.dispatcher.resume();
    }

    leave() {
        this.dispatcher.destroy();
        this.connection.disconnect();      
    }
}


/**
 * 
 * @param {number} userID  the user's id
 * @param {number} guildID the message's guild (server) id
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