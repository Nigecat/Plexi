const { MessageEmbed } = require("discord.js");
const Database = require("../../database.js");
const Config = require("../../data/config.json");

module.exports = {
    args: "<set>",
    description: "Get the cards contained in a certain set",
    call: function(message, args) {
        args = args.join(" ");
        let cards = []
        let database = new Database(Config.database, Config.default_prefix);
        database.database.all(`SELECT * FROM Card WHERE set_name = ? COLLATE NOCASE`, args, (err, rows) => {
            if (rows.length > 0) {
                rows.forEach(row => {
                    cards.push(`${row.name} - ${row.power} power`);
                });
                let embed = new MessageEmbed()
                    .setColor([114, 137, 218])
                    .addField(`Cards in the ${args} set:`, cards.join("\n"))
                    .setFooter(`[${rows.length} cards]`);
                message.channel.send({embed});
            } else {
                message.channel.send("Invalid set");
            }
        });
        database.disconnect();
    }
}