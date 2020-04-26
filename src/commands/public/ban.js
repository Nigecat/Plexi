
module.exports = {
    args: ["<@user>"],
    perms: ["BAN_MEMBERS"],
    description: "Ban a user (will delete all their messages)",
    call: function (message, args) {
        try {
            message.mentions.members.first().ban().then(() => {
                message.channel.send(`**Successfully banned:** ${message.mentions.members.first().user.tag}`);
            }).catch(err => {
                message.channel.send("It appears something has gone wrong, chances are you attempted to ban someone who has a higher role then this bot.");
            });
        } catch (err) {
            message.channel.send("It appears something has gone wrong, chances are you didn't @ a valid user");
        }
    }
}