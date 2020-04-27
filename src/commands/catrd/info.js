const { MessageEmbed } = require("discord.js");
const Database = require("../../database.js");
const Config = require("../../data/config.json");

function capitalizeFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
  }

module.exports = {
    args: "[card]",
    description: "Get info on a card",
    call: function(message, args) {
        let name = args.join(" ");
        let database = new Database(Config.database, Config.default_prefix);
        database.database.all(`SELECT * FROM Card WHERE name = ? COLLATE NOCASE`, name, (err, rows) => {
            if (rows.length > 0) {
                let card = rows[0];
                let embed = new MessageEmbed()
                    .setColor([114, 137, 218])
                    .setTitle(card.name);

                Object.keys(card).forEach(key => {
                    embed.addField(capitalizeFirstLetter(key).split("_").join(" "), card[key]);
                });

                message.channel.send({embed});
                message.channel.send({files: [`./commands/resources/catrd/${card.set_name}/${card.name}.jpg`]})
            } else {
                message.channel.send("Card not found");
            }
        });
        database.disconnect();
    }
}