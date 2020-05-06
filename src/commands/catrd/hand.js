const { MessageEmbed } = require("discord.js");
const Database = require("../../database.js");
const Config = require("../../data/config.json");

module.exports = {
    args: [],
    description: "View the cards currently left in your hand during a duel",
    call: function(message) {
        let database = new Database(Config.database, Config.default_prefix);
        database.checkExpire(message.author.id);     
        database.inMatch(message.author.id).then(match => {
            if (match) {
                database.getGame(message.author.id, row => {
                    try  {
                        let user = row.user1 == message.author.id ? "user1" : "user2";
                        let embed = new MessageEmbed()  
                            .setColor([255, 0, 0])
                            .setTitle(`The cards in your hand:`)
                            .addField("‎‎", JSON.parse(row[`${user}hand`]).join("\n"));

                        message.author.send({embed})
                    } catch (err) {
                        message.author.send("It appears you don't have any cards left in your hand!");
                    }
                }); 
            } else {
                message.channel.send("You must be in a duel to run this command!");
            }
        });
    }
}