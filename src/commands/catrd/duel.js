
module.exports = {
    args: ["<@user>"],
    description: "TODO",
    call: function(message, args) {
        if (message.member.voice.channel) {
            message.member.voice.channel.join().then(connection => {
                const dispatcher = connection.play("./commands/resources/its time to duel.mp3", { volume: 1 });
                dispatcher.on('finish', () => {
                    connection.disconnect();
                    dispatcher.destroy();
                });
            });
        }

        // TODO: actual duel code
    }
}