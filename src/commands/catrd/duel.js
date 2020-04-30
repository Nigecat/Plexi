const Database = require("../../database.js");
const Config = require("../../data/config.json");

module.exports = {
    args: ["<@user>"],
    description: "TODO GAMEPLAY INSTRUCTIONS",
    call: function(message, args) {
        if (message.mentions.members.first() != undefined) {
            if (message.mentions.members.first().id != message.author.id) {
                let database = new Database(Config.database, Config.default_prefix);
                let user1 = { id: message.author.id, deck: [] };
                let user2 = { id: message.mentions.members.first().id, deck: [] }
                database.addUser(user1.id);
                database.addUser(user2.id);
                database.getUser(user1.id, row => {
                    user1.deck = JSON.parse(row.deck);
                    if (user1.deck.length > 19) {
                        database.getUser(user2.id, row2 => {
                            user2.deck = JSON.parse(row2.deck);
                            if (user2.deck.length > 19) {
                               // database.database.run()
                                message.channel.send(`Commencing duel between ${message.author} and ${message.mentions.members.first()}`);
                            } else {
                                message.channel.send(`The person you are trying to duel needs another ${20 - user2.deck.length} cards in their deck before they can duel!`);
                            }
                        });
                    } else {
                        message.channel.send(`You need another ${20 - user1.deck.length} cards in your deck before you can duel!`);
                    }
                });
                database.disconnect();
            } else {
                message.channel.send("You can't duel yourself!");
            }
        } else {
            message.channel.send("Invalid user");
        }
    }
}