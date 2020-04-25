const { wordReact } = require("../util.js");

module.exports = {
    args: ["<word>"],
    perms: [],
    description: "Respond to the previous message with a word in the form of emojis (only supports a-z, duplicate characters won't work)",
    call: function (message, args) {
        message.channel.messages.fetch({ limit: 2 }).then(messages => {
            wordReact(messages.get(Array.from(messages.keys())[1]), args[0]);   // get second last message
            message.delete();
        });
    }
}