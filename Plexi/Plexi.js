const ytdl = require('./modules/node_modules/ytdl-core');
const Discord = require('./modules/node_modules/discord.js');

const CONFIG = JSON.parse(require('fs').readFileSync(`${__dirname}/config/config.json`));
const TOKEN = CONFIG.TOKEN;
const PREFIX = CONFIG.PREFIX;

const client = new Discord.Client();



client.on('ready', () => {
    this.queue = new Array();

    console.log("Servers:");
    client.guilds.forEach((guild) => {
        console.log(`\n - ${guild.name}:`);
        console.log(`    -- Members:`);
        guild.members.forEach((member) => {
            console.log(`       --- ${member.displayName}: ${member.user.tag}`);
        });
        console.log(`    -- Channels:`);
        guild.channels.forEach((channel) => {
            if (channel.type == "text") {
                console.log(`       --- ${channel.name}`);
            }
        })
    });

    client.user.setActivity(`your soul (${PREFIX}help)`, {type: "WATCHING"})
    console.log(`\n\nConnected as ${client.user.tag}, prefix: ${PREFIX}\n`);
});




client.on('message', async message => {
    if (message.author != client.user && message.content.startsWith(PREFIX)) {
        console.log(`Command received: ${message.content}`);

        let command = message.content.split(PREFIX).slice(1).join(PREFIX).toLowerCase().split(" ")[0];    // remove token from string and get first word
        let args = message.content.split(" ").slice(1);

        switch (command) {
            case "help": {
                let embed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Plexi')
                    .setDescription('this entire project was a bad idea...')
                    .addBlankField()
                    .setThumbnail('https://cdn.discordapp.com/avatars/621179289491996683/9746eaab6605b25c429b3d1459d172a6.png?size=128')
                    .addField('‎', 'Text Commands:')
                    .addField(`${PREFIX}whatsmypeanut\t\t${PREFIX}whatstheirpeanut <@user>`, '‎')
                    .addField('‎', 'Audio Commands:')
                    .addField(`${PREFIX}play <url>\t\t${PREFIX}pause\t\t${PREFIX}unpause`, '‎')
                    .addField(`${PREFIX}bruh\t\t${PREFIX}sec\t\t${PREFIX}mop\t\t${PREFIX}naeg`, '‎')
                    .setTimestamp()
                message.channel.send({embed});
                break;
            }

    


            /**
             * Get the user's peanut level
             */
            case "whatsmypeanut": {
                message.channel.send(`Your peanut meter level is currently at ${peanut(message.author.id, message.guild.id)}!`);
                message.channel.send("`Calculated with peanut algorithm™`");
                break;
            }

            /**
             * Get the mentioned user's peanut level
             * @parem <@user>
             */
            case "whatstheirpeanut": {
                message.channel.send(`${message.mentions.users.first()}'s peanut meter level is currently at ${peanut(message.mentions.members.first().id, message.guild.id)}`);
                message.channel.send("`Calculated with peanut algorithm™`");
                break;
            }

            /**
             * Download a YouTube video's audio and upload the mp3
             * @parem <url>
             */
            case "download": {
                // TODO
            }







            /**
             * Lock a user in their current voice channel
             * @parem <@user>
             */
            case "lock": {
                message.delete();
                var user = message.mentions.members.first();
                var lockChannel = user.voice.channel;
                this.lock = setInterval(function() { user.voice.setChannel(lockChannel)}, 1000);
                break;
            }

            /**
             * Remove all active locks
             */
            case "unlock": {
                message.delete();
                clearInterval(this.lock);
                break;
            }

            /**
             * Drag a mentioned user into the message sender's voice channel
             * @parem <@user>
             */
            case "drag": {
                message.delete();
                message.mentions.members.first().voice.setChannel(message.member.voice.channel);
                break;
            }

            /**
             * Make a user follow another user
             * @parem <@user> follower
             * @parem <@user> leader
             */
            case "follow": {
                message.delete();
                var leader = message.mentions.members.last();
                var follower = message.mentions.members.first();
                this.follow = setInterval(function () { follower.voice.setChannel(leader.voice.channel) }, 1000);
                break;
            }

            /**
             * Removed all active followings
             */
            case "unfollow": {
                message.delete()
                clearInterval(this.follow);
                break;
            }

            /**
             * Play audio from a YouTube video into a voice channel
             * @parem <url>
             */
            case "p":
            case "play": {
                this.player = new audioPlayer(message, args[0], "online", 1, false);
                this.player.play();
                break;
            }

            /**
             * Pause currently playing audio
             */
            case "pause": {
                message.delete();
                this.player.pause();
                break;
            }

            /**
             * Unpause currently playing audio
             */
            case "resume":
            case "unpause": {
                message.delete();
                this.player.resume();
                break;
            }

            /**
             * Diconnect bot from current voice channel
             */
            case "leave":
            case "disconnect": {
                message.delete();
                this.player.leave();
                break;
            }

            /**
             * View current audio queue
             */
            case "q":
            case "queue": {   
                // TODO
            }

            /**
             * Skip currently playing song
             */
            case "s": 
            case "skip": {
                // TODO
            }

            case "bruh": {
                this.player = new audioPlayer(message, "sound/bruh.mp3", "local", 2, true);
                this.player.play();
                break;
            }

            case "mop": {
                this.player = new audioPlayer(message, "sound/mop.mp3", "local", 1, true);
                this.player.play();
                break;
            }            
            
            case "sec": {
                this.player = new audioPlayer(message, "sound/sec.mp3", "local", 1, true);
                this.player.play();
                break;
            }

            case "naeg": {
                this.player = new audioPlayer(message, "sound/naeg.mp3", "local", 2, true);
                this.player.play();
                break;
            }
        }
    }
});

client.login(TOKEN);













class audioPlayer {
    /**
     * @class 
     * @param {object}  message     user's message object
     * @param {string}  source      source location for audio to play, can be web url or local file (local is relative file path)
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
                        this.dispatcher = this.connection.play(`${__dirname}/${this.source}`, {
                            volume: this.volume
                        });
                    } else if (this.location == "online") {
                        this.dispatcher = this.connection.play(ytdl(this.source, {
                            filter: 'audioonly' 
                        }), {
                            volume: this.volume
                        });
                    }
                    if (this.disconnect) {
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


/**
 * @param {object} message  the message object to check the perms of
 * @param {string} perm     the perm to check
 * @return {boolean}
 */
function hasPerm(message, perm) {
    return message.member.hasPermission(perm);
}