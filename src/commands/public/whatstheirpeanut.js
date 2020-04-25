const { checkPeanut } = require("../util.js");

module.exports = {
    args: ["<@user>"],
    perms: [],
    description: "Check another user's peanut level",
    call: function (message) {
        checkPeanut(message.mentions.members.first().id, message.guild, level => {
            message.channel.send(`${message.mentions.users.first()}'s peanut meter level is currently at ${level}`);
            message.channel.send("`Calculated with peanut algorithm™`");
        });
    }
}