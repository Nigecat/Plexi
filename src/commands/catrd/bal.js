const { MessageEmbed } = require("discord.js");
const Database = require("../../database.js");
const Config = require("../../data/config.json");

module.exports = {
    args: [],
    description: "Check your coin balance",
    call: function(message) {
        let database = new Database(Config.database, Config.default_prefix);
        database.getUser(message.author.id, row => {
            message.channel.send(`You have ${row.coins} coins!`);
        });
        database.disconnect();
    }
}