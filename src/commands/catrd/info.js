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
                    .setTitle(card.name)
                    // replace all spaces with an underscore because for some reason if the file has a space in it, it doesn't appear inside the embed
                    .attachFiles([`./commands/resources/catrd/${card.set_name}/${card.name.split(" ").join("_")}.jpg`]) 
                    .setImage(`attachment://${card.name.split(" ").join("_")}.jpg`);

                Object.keys(card).forEach(key => {
                    embed.addField(capitalizeFirstLetter(key).split("_").join(" "), card[key]);
                });

                embed.addField("Sell price:", `${Math.floor((30 - rows[0].rarity) ** 1.433)} coins`);

                message.channel.send({embed});
            } else {
                message.channel.send("Card not found");
            }
        });
        database.disconnect();
    }
}