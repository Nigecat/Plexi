const ytdl = require('ytdl-core');

module.exports.AudioHandler = class AudioHandler {
    constructor() {
        this.vc = false;
        this.connection = false;
        this.queue = [];
    }

    play(message, url) {
        if (this.connection) {
            this.queue.push(url);
            message.channel.send(`Adding \`${url}\` to queue position \`${this.queue.length}/${this.queue.length}\``)
        } else {
            this.queue.push(url);
            this.vc = message.member.voice.channel;
            this.vc.join().then(connection => {
                this.connection = connection;
                const dispatcher = connection.play(ytdl(url, { filter: 'audioonly' }));
                this.playing = true;
                dispatcher.on('end', () => {
                    this.connection.disconnect();
                    this.connection = false;
                    this.vc = false;
                });
            });
        }
    } 

    skip() {
        const dispatcher = this.connection.play(ytdl(this.queue.shift(), { filter: 'audioonly' }));
        dispatcher.on('end', () => {
            this.connection.disconnect();
            this.connection = false;
            this.vc = false;
        });   
    }
    
    getQueue() {
        let text = [];
        this.queue.forEach((url, index) => {
            text.push(`${index + 1}. \`${url}\``)
        });
        return text.join('\n');
    }

    clear() {
        this.connection.disconnect();
        this.connection = false;
        this.vc = false;
        this.queue = [];
    }

    disconnect() {
        this.connection.disconnect();
        this.connection = false;
        this.vc = false;
        this.queue = [];
    }
}