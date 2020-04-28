
module.exports = {
    args: [],
    perms: [],
    description: "🦀 Add crabs around the previous message 🦀",
    call: function(message) {
        message.channel.messages.fetch({ limit: 2 }).then(messages => {
            message.channel.send(`🦀 ${messages.get(Array.from(messages.keys())[1]).content} 🦀`);
        });
    }
}