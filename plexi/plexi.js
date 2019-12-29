const fs = require('fs');
const ytdl = require('./modules/node_modules/ytdl-core');
const Discord = require('./modules/node_modules/discord.js');

const CONFIG = JSON.parse(fs.readFileSync(`${__dirname}/config.json`));
const TOKEN = CONFIG.TOKEN;
const PREFIX = CONFIG.PREFIX;

const client = new Discord.Client();


client.on('ready', () => {
    console.log("Servers:");
    client.guilds.forEach((guild) => {
        console.log(`\n - ${guild.name}:`);
        console.log(`    -- Members:`);
        guild.members.forEach((member) => {
            console.log(`       --- ${member.displayName}: ${member.user.tag} (${member.user.presence.status})`);
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



client.on('message', (message) => {
    if (message.author != client.user) {
        
        (() => {        // so we dont pollute the global object
            let file = `${__dirname}/data/user/${message.author.id}.json`;
            if (!fs.existsSync(file)) {
                var data = { peanut: 0 };
            } else {
                var data = JSON.parse(fs.readFileSync(file));
            }
    
            if (!message.content.startsWith(PREFIX)) {
                data.peanut += (message.content.match(/peanut/g) || []).length;
            }
            fs.writeFileSync(file, JSON.stringify(data, null, 4)); 
        })()

        if (message.content.startsWith(PREFIX)) {
            console.log(`Command received: ${message.content} from ${message.author.tag}`);
    
            let command = message.content.split(PREFIX).slice(1).join(PREFIX).toLowerCase().split(" ")[0];    // remove token from string and get first word
            let args = message.content.split(" ").slice(1);
            
    
            //Un-restricted text commands
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
                        .addField(`${PREFIX}lock <@user>\t\t${PREFIX}unlock <@user>`, '‎')
    
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
                    peanut(message.author.id, message.guild, (level) => {
                        message.channel.send(`Your peanut meter level is currently at ${level}!`);
                        message.channel.send("`Calculated with peanut algorithm™`");
                    });
                    break;
                }
    
                /**
                 * Get the mentioned user's peanut level
                 * @parem <@user>
                 */
                case "whatstheirpeanut": {
                    peanut(message.mentions.members.first().id, message.guild, (level) => {
                        message.channel.send(`${message.mentions.users.first()}'s peanut meter level is currently at ${level}`);
                        message.channel.send("`Calculated with peanut algorithm™`");
                    });
                    break;
                }
            }
    
    
    
            // !-------------------------------------------------------------------------------------------------------------!
    
            
    
            //Un-restricted audio commands
            switch (command) {
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
    
    
    
            // !-------------------------------------------------------------------------------------------------------------!
    
    
    
            //Restricted commands
            switch (command) {
                /**
                 * Lock a user in their current voice channel   *only one active per server
                 * @parem <@user>
                 */
                case "lock": {
                    if (message.member.hasPermission("ADMINISTRATOR")) {      // admin only since this is potentially server-breaking
                        message.delete();
                        var user = message.mentions.members.first();
                        var lockChannel = user.voice.channel;
                        this.lock = setInterval(function() { user.voice.setChannel(lockChannel)}, 1000);
                    } else {
                        missingPerm(message, "ADMINISTRATOR");
                    }
                    break;
                }
    
                /**
                 * Remove all active locks
                 */
                case "unlock": {
                    if (message.member.hasPermission("ADMINISTRATOR")) {   
                        message.delete();
                        clearInterval(this.lock);
                    } else {
                        missingPerm(message, "ADMINISTRATOR");
                    }
                    break;
                }
    
                /**
                 * Make a user follow another user    *only one active per server
                 * @parem <@user> leader
                 * @parem <@user> follower
                 */
                case "follow": {
                    if (message.member.hasPermission("ADMINISTRATOR")) {      // admin only since this is potentially server-breaking
                        message.delete();
                        var leader = message.mentions.members.last();
                        var follower = message.mentions.members.first();
                        this.follow = setInterval(function () { follower.voice.setChannel(leader.voice.channel) }, 1000);
                    } else {
                        missingPerm(message, "ADMINISTRATOR");
                    }
                    break;
                }
    
                /**
                 * Removed all active followings
                 */
                case "unfollow": {
                    if (message.member.hasPermission("ADMINISTRATOR")) {   
                        message.delete()
                        clearInterval(this.follow);
                    } else {
                        missingPerm(message, "ADMINISTRATOR");
                    }
                    break;
                }
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
 * @param {object} guild the message's guild (server) object
 * @param {object} channel the message's channel
 * @param {function} callback
 */
function peanut(userID, guild, callback) {
    callback(((
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
                guild.id.split("")[0]
            ) * userID.split("")
                    .reduce(
                        (a, b) => parseInt(a) + parseInt(b), 0
                    )
        )
    ) / 10) + JSON.parse(fs.readFileSync(`${__dirname}/data/user/${userID}.json`)).peanut);
}


/**
 * 
 * @param {object}  message the message object
 * @param {*string} perm    the permission that is missing
 */
function missingPerm(message, perm) {
    message.reply(`you require the ${perm.toLowerCase()} permission to run that command!`);
}