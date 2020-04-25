const wd = require("word-definition");

module.exports = {
    args: ["<word>"],
    perms: [],
    description: "Get the definition of a word",
    call: function(message, args) {
        wd.getDef(args[0], "en", null, definition => {
            message.channel.send(`**Word:** ${definition.word}\n**Category:** ${definition.category}\n**Definition:** ${definition.definition}`);
        });
    }
}