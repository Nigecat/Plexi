
module.exports = {
    args: [],
    perms: [],
    description: "Flip a coin",
    call: function (message, args) {
        message.channel.send(Math.floor((Math.random() * 2) + 1) == 1 ? "heads" : "tails");
    }
}