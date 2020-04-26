
module.exports = {
    args: "[search]",
    perms: [],
    description: "LMGTFY a search query",
    call: function(message, args) {
        message.channel.send(`http://lmgtfy.com/?q=${args.join("+")}`);
    }
}