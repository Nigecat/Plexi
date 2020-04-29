const { MessageEmbed } = require("discord.js");
const Database = require("../../database.js");
const Config = require("../../data/config.json");

module.exports = {
    args: [],
    description: "View what cards you have in your deck",
    call: function(message) {
        let database = new Database(Config.database, Config.default_prefix);
        database.addUser(message.author.id);
        database.getUser(message.author.id, row => {
            let cards = JSON.parse(row.deck);

            if (cards.length > 0) {
                let embed = new MessageEmbed()  
                    .setColor([114, 137, 218])
                    .setTitle(`Run catrd add <card> to add a card to your deck,\nrun catrd remove <card> to remove a card from the deck:`)
                
                embed.addField("‎", cards.join("\n"));
            
                message.channel.send({embed});
            } else {
                message.channel.send("It appears you have an empty deck, run `catrd add <card>` to transfer a card into your deck, run `catrd cards` to see what cards you have!");
            }
        });
        database.disconnect();
    }
}