const { toEmoji } = require("../util.js");

module.exports = {
    args: "[text]",
    perms: [],
    description: "Makes the specified text bigger",
    call: function(message, args) {
        message.channel.send(toEmoji(args.join(" ")).join(" "));
    }
}