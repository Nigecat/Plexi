
module.exports = {
    args: [],
    perms: [],
    description: "Get a bot invite link",
    call: function(message) {
        message.channel.send("https://discordapp.com/oauth2/authorize?client_id=621179289491996683&permissions=8&scope=bot");
    }
}