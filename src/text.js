const utils = require('./utils.js');

module.exports = {
    whatsmypeanut: whatsmypeanut,
    whatstheirpeanut: whatstheirpeanut
}



function whatsmypeanut(message) {
    utils.checkPeanut(message.author.id, message.guild, level => {
        message.channel.send(`Your peanut meter level is currently at ${level}!`);
        message.channel.send("`Calculated with peanut algorithm™`");
    });
}

function whatstheirpeanut(message) {
    utils.checkPeanut(message.mentions.members.first().id, message.guild, level => {
        message.channel.send(`${message.mentions.users.first()}'s peanut meter level is currently at ${level}`);
        message.channel.send("`Calculated with peanut algorithm™`");
    });
}