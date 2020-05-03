const { MessageEmbed } = require("discord.js");
const Database = require("../../database.js");
const Config = require("../../data/config.json");

function capitalizeFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
}

module.exports = {
    args: "[card]",
    description: "Add a card to your deck from your card pool",
    call: function(message, args) {
        let database = new Database(Config.database, Config.default_prefix);
        database.addUser(message.author.id);
        database.getUser(message.author.id, row => {
            if (args[args.length - 2] == "(alt") {
                args[args.length - 2] = "(Alt";
            }
            args = args.map(w => capitalizeFirstLetter(w)).join(" ");
            let cards = JSON.parse(row.cards);
            let deck = JSON.parse(row.deck);
            if (deck.length < 20) {
                if (cards.includes(args)) {
                    cards.splice(cards.indexOf(args), 1);
                    deck.push(args);
                    database.updateUser(message.author.id, "cards", JSON.stringify(cards));
                    database.updateUser(message.author.id, "deck", JSON.stringify(deck));
                    message.channel.send(`${args} added from deck`);
                } else {
                    message.channel.send("You don't have that card");
                }
            } else {
                message.channel.send("You have hit the maximum deck size of 20 cards!")
            }
        });
        database.disconnect();
    }
}