const { MessageEmbed } = require("discord.js");

module.exports = {
    args: [],
    perms: [],
    description: "Mock the previous message",
    call: function(message) {
        message.channel.messages.fetch({ limit: 2 }).then(messages => {
            let message = messages.get(Array.from(messages.keys())[1]);
            let text = message.content.split("");
            text.forEach((char, i) => {
                text[i] = Math.floor((Math.random() * 2) + 1) == 1 ? text[i].toLowerCase() : text[i].toUpperCase();
            });
            let embed = new MessageEmbed()
                .setColor([114, 137, 218])
                .setTitle(`${text.join("")} - ${message.author.tag}`)
                .attachFiles(["./commands/resources/spongebob_mocking.png"])
                .setImage('attachment://spongebob_mocking.png');

            message.channel.send({embed});
        });
    }
}