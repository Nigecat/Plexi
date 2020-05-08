
module.exports = {
    args: ["<@user1>", "<@user2>"],
    perms: [],
    description: "Ship two users (attempts to merge their names)",
    call: function(message) {
        try {
            let user1 = Array.from(message.mentions.members)[0][1].user.username;
            let user2 = Array.from(message.mentions.members)[1][1].user.username;
            let firsthalf = user1.slice(0, Math.ceil(user1.length / 2));
            let secondhalf = user2.slice(Math.ceil(user2.length / 2) * -1);
            
            // combine the first half of user1's username with the second half of user2's username
            message.channel.send(`**${user1} 💞 ${user2} = ${firsthalf}${secondhalf}**`);
        } catch (err) {
            message.channel.send("Invalid user (you may have accidently mentioned a role not a user)!");
        }
    }
}