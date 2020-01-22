const ytdl = require('ytdl-core');


/**
 * @param {number}  userID  the user's id
 * @param {object}  guild   the message's guild (server) object
 * @param {object}  channel the message's channel
 * @param {function} callback
 */
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




/**
 * 
 * @param {object}  message the message object
 * @param {string} perm     the permission that is missing
 */
function missingPerm(message, perm) {
    message.reply(`you require the ${perm.toLowerCase()} permission to run that command!`);
}





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
















module.exports = {
    checkPeanut: checkPeanut,
    audioPlayer: audioPlayer,
    missingPerm: missingPerm
}