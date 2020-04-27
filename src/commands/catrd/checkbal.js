const { MessageEmbed } = require("discord.js");
const Database = require("../../database.js");
const Config = require("../../data/config.json");

module.exports = {
    args: ["<@user>"],
    description: "Check another user's balance",
    call: function(message) {
        let database = new Database(Config.database, Config.default_prefix);
        database.addUser(message.mentions.members.first().id);
        database.getUser(message.mentions.members.first().id, row => {
            message.channel.send(`${message.mentions.members.first()} has ${row.coins} coins!`);
        });

        database.disconnect();
    }
}