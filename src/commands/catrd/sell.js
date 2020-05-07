const Database = require("../../database.js");
const Config = require("../../data/config.json");

function capitalizeFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
}

module.exports = {
    args: "<card>",
    description: "Sell a card",
    call: function(message, args) {
        let database = new Database(Config.database, Config.default_prefix);
        database.addUser(message.author.id);
        database.getUser(message.author.id, row => {
            if (args[args.length - 2] == "(alt") {
                args[args.length - 2] = "(Alt";
            }
            args = args.map(w => capitalizeFirstLetter(w)).join(" ").split("-").map(w => capitalizeFirstLetter(w)).join("-");
            let cards = JSON.parse(row.cards);

            if (cards.includes(args)) {
                cards.splice(cards.indexOf(args), 1);
                database.updateUser(message.author.id, "cards", JSON.stringify(cards));
                database.database.get(`SELECT rarity FROM Card WHERE name = ?`, args, (err, row) => {
                    database.getUser(message.author.id, user => {
                        let cost = Math.floor((30 - row.rarity) ** 1.433);
                        database.updateUser(message.author.id, "coins", user.coins + cost);
                        message.channel.send(`You have sold ${args} for ${cost} coins!`);
                    });
                });
            } else {    
                message.channel.send("You don't have that card (or it's in your deck, if you want to sell a card in your deck remove it first)");
            }
        });
        database.disconnect();
    }
}