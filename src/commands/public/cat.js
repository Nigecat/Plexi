const fetch = require('node-fetch');
const { MessageEmbed } = require("discord.js");

module.exports = {
    args: [],
    perms: [],
    description: "Get a random post from /r/cats",
    call: function(message, args) {
        fetch(`https://www.reddit.com/r/cats/random.json?limit=1000`)
            .then(res => res.json())
            .then(res => {
                let post = res.data.children[Math.floor(Math.random() * res.data.children.length)].data;
                let embed = new MessageEmbed()
                    .setColor([114, 137, 218])
                    .setTitle(post.title)
                    .setImage(post.url);

                message.channel.send({embed});
            });
    }
}