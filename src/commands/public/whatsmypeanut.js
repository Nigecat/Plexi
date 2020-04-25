const { checkPeanut } = require("../util.js");

module.exports = {
    args: [],
    description: "Check your peanut level",
    call: function (message) {
        checkPeanut(message.author.id, message.guild, level => {
            message.channel.send(`Your peanut meter level is currently at ${level}!`);
            message.channel.send("`Calculated with peanut algorithm™`");
        });
    }
}