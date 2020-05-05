const { MessageEmbed } = require("discord.js");
const Database = require("../../database.js");
const Config = require("../../data/config.json");

module.exports = {
    args: [],
    description: "View all valid sets and their costs, run catrd setinfo <set> to view the cards in a set",
    call: function(message, args) {
        let database = new Database(Config.database, Config.default_prefix);
        let embed = new MessageEmbed()
            .setColor([114, 137, 218])
            .setTitle("Valid catrd sets");

        database.database.all(`SELECT * FROM Sets`, (err, rows) => {
            rows.forEach(row => {
                embed.addField(`${row.set_name} - ${row.cost} coins`, "‎");
            });
            message.channel.send({embed});
        });
        database.disconnect();
    }
}