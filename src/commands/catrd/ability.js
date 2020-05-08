const { MessageEmbed } = require("discord.js");
const Database = require("../../database.js");
const Config = require("../../data/config.json");

function capitalizeFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
}

module.exports = {
    args: "[ability]",
    description: "Get info on an ability",
    call: function(message, args) {
        let name = args.join(" ");
        let database = new Database(Config.database, Config.default_prefix);
        database.database.all(`SELECT * FROM Ability WHERE ability_name = ? COLLATE NOCASE`, name, (err, rows) => {
            if (rows.length > 0) {
                let card = rows[0];
                let embed = new MessageEmbed()
                    .setColor([114, 137, 218])
                    .setTitle(card.ability_name)
                    .addField("Description", card.description);

                message.channel.send({embed});
            } else {
                message.channel.send("Ability not found");
            }
        });
        database.disconnect();
    }   
}