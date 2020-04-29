const { MessageEmbed } = require("discord.js");
const Database = require("../../database.js");
const Config = require("../../data/config.json");

module.exports = {
    args: [],
    description: "View what cards you have that aren't in your deck",
    call: function(message) {
        let database = new Database(Config.database, Config.default_prefix);
        database.addUser(message.author.id);
        database.getUser(message.author.id, row => {
            let cards = JSON.parse(row.cards);

            if (cards.length > 0) {
                let embed = new MessageEmbed()  
                    .setColor([114, 137, 218])
                    .setTitle(`These are cards not in your deck, run catrd deck to see those,\nRun catrd info [card] for more details on a card:`)
                
                embed.addField("‎", cards.join("\n"));
            
                message.channel.send({embed});
            } else {
                message.channel.send("It appears you don't have any cards, run `catrd help buy` to get some!");
            }
        });
        database.disconnect();
    }
}