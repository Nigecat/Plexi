const got = require("got");
const { MessageEmbed } = require("discord.js");

module.exports = {
    args: ["<subreddit>"],
    perms: [],
    description: "Get a random post from /r/<subreddit>",
    call: function(message, args) {
        message.channel.startTyping();

        got(`https://imgur.com/r/${args[0]}/hot.json`).then(response => {
            let images = JSON.parse(response.body).data;    
            let image = images[Math.floor(Math.random() * images.length)];
            let url = `http://imgur.com/${image.hash}${image.ext.replace(/\?.*/, '')}`;
            let title = image.title;
        
            let embed = new MessageEmbed()
                .setTitle(title)
                .setImage(url);
            message.channel.send({embed});
        }).catch(() => {
            message.channel.send("That subreddit could not be found!");
            message.channel.stopTyping();
        });            
    }
}