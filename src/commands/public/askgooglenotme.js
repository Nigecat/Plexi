
module.exports = {
    args: [],
    perms: [],
    description: "LMGTFY the previous message",
    call: function(message, args) {
        message.channel.messages.fetch({ limit: 2 }).then(messages => {
            let message = messages.get(Array.from(messages.keys())[1]);
            message.channel.send(`http://lmgtfy.com/?q=${message.content.split(" ").join("+")}`);
        });
    }
}