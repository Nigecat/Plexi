const ytdl = require("ytdl-core");

module.exports = {
    args: [],
    perms: [],
    description: "Chill to some lofi beats",
    call: function(message) {
        message.member.voice.channel.join().then(connection => {
            connection.play(ytdl("https://youtu.be/5qap5aO4i9A", {
                highWaterMark: 1024 * 1024 * 10 
            }));
        });
    }
}