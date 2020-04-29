const { checkPeanut } = require("../util.js");

module.exports = {
    args: [],
    perms: [],
    description: "Check your peanut level, you gain a peanut everytime the word 'peanut' appears in one of your messages",
    call: function (message) {
        checkPeanut(message.author.id, message.guild, level => {
            message.channel.send(`Your peanut meter level is currently at ${level}!`);
            message.channel.send("`Calculated with peanut algorithm™`");
        });
    }
}