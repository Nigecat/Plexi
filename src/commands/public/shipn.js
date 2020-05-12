
module.exports = {
    args: ["<@user1>", "<@user2>"],
    perms: [],
    description: "Ship two users by nickname (attempts to merge their nicknames)",
    call: function(message) {
        try {
            let user1 = message.guild.member(Array.from(message.mentions.members)[0][1].user).displayName;
            let user2 = message.guild.member(Array.from(message.mentions.members)[1][1].user).displayName;
            let firsthalf = user1.slice(0, Math.ceil(user1.length / 2));
            let secondhalf = user2.slice(Math.ceil(user2.length / 2) * -1);
            
            // combine the first half of user1's username with the second half of user2's username
            message.channel.send(`**${user1} 💞 ${user2} = ${firsthalf}${secondhalf}**`);
        } catch (err) {
            message.channel.send("Invalid user (you may have accidently mentioned a role not a user)!");
        }
    }
}