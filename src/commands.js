
module.exports = {
    whatsmypeanut: {
        call: whatsmypeanut,
        description: "Check your own peanut level",
        args: []
    },
    whatstheirpeanut: {
        call: whatstheirpeanut,
        description: "Check a user's peanut level",
        args: ["<@user>"]
    }
}



function whatsmypeanut(message) {
    checkPeanut(message.author.id, message.guild, level => {
        message.channel.send(`Your peanut meter level is currently at ${level}!`);
        message.channel.send("`Calculated with peanut algorithm™`");
    });
}

function whatstheirpeanut(message) {
    checkPeanut(message.mentions.members.first().id, message.guild, level => {
        message.channel.send(`${message.mentions.users.first()}'s peanut meter level is currently at ${level}`);
        message.channel.send("`Calculated with peanut algorithm™`");
    });
}



function checkPeanut(userID, guild, callback) {
    callback((
        (
            (
                parseInt(userID.split("")[0]) + 1
            ) * (
                parseInt(userID.split("")[1]) + 1
            ) * (
                parseInt(userID.split("")[2]) + 1
            ) * (
                parseInt(userID.split("")[3]) + 1)
        ) / 10 + (
            parseInt(guild.id.split("")[0]) * userID.split("")
                .reduce((a, b) => parseInt(a) + parseInt(b), 0)
        )
    ) / 10);
}