const ud = require("urban-dictionary");

module.exports = {
    args: ["<word>"],
    perms: [],
    description: "Get the urban dictionary definition of a word",
    call: function(message, args) {
        ud.term(args[0], (err, entries, tags, sounds) => {
            if (err) {
                message.channel.send("Word not found");
            } else {
                message.channel.send(`**Urban dictionary definition:**\n**Word:** ${entries[0].word}\n**Definition:** ${entries[0].definition}\n**Example:** ${entries[0].example}`);
            }
        });
    }
}