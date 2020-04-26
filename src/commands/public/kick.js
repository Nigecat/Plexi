
module.exports = {
    args: ["<@user>"],
    perms: ["KICK_MEMBERS"],
    description: "Kick a user",
    call: function (message, args) {
        try {
            message.mentions.members.first().kick().then(() => {
                message.channel.send(`**Successfully kicked:** ${message.mentions.members.first().user.tag}`);
            }).catch(err => {
                message.channel.send("It appears something has gone wrong, chances are you attempted to kick someone who has a higher role then this bot.");
            });
        } catch (err) {
            message.channel.send("It appears something has gone wrong, chances are you didn't @ a valid user");
        }
    }
}