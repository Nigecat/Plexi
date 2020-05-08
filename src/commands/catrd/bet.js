const Database = require("../../database.js");
const Config = require("../../data/config.json");

function capitalizeFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
}

module.exports = {
    args: "<card|coins>",
    description: "Set your bet for a game, only works while in a duel",
    call: function(message, args) {
        let database = new Database(Config.database, Config.default_prefix);
        database.checkExpire(message.author.id);
        database.inMatch(message.author.id).then(match => {
            if (match) {
                if (args[0].toLowerCase() == "confirm") {
                    database.getGame(message.author.id, row => {
                        if ((row.user1 == message.author.id && row.user1bet != null) || (row.user2 == message.author.id && row.user2bet != null)) {
                            database.updateGame(message.author.id, "betconfirm", 1, () => {
                                database.getGame(message.author.id, info => {
                                    if (!!info.user1betconfirm && !!info.user2betconfirm) {
                                        message.channel.send(`The bets have now been confirmed! The game shall now commence. ${info.user1tag}, run catrd play <card> to play a card you have onto the board.`);
                                        database.updateGameVal(message.author.id, "round", 1);
                                        database.updateGame(message.author.id, "timeout", (Date.now() + 600000).toString());
                                    } else {
                                        message.channel.send("Please get your duel partner to also confirm the bet now");
                                    }
                                });
                            });
                        } else {
                            message.channel.send("You must place a bet before you can confirm!");
                        }
                    });
                } else {
                    database.getUser(message.author.id, row => {
                        if (args.length == 1 && !isNaN(args[0])) {  // coin bet
                            args[0] = parseInt(args[0]);
                            if (row.coins >= args[0]) {
                                message.reply(`your bet has been set to ${args[0]} coins`);
                                database.updateGame(message.author.id, "bet", args[0]);
                            } else {
                                message.channel.send("You don't have that many coins!");
                            }
                        } else {    // card bet
                            args = args.map(w => capitalizeFirstLetter(w)).join(" ").split("-").map(w => capitalizeFirstLetter(w)).join("-");
                            if (JSON.parse(row.cards).includes(args) || JSON.parse(row.deck).includes(args)) {
                                message.reply(`your bet has been set to ${args}`);
                                database.updateGame(message.author.id, "bet", args);
                            } else {
                                message.channel.send("You can't bet a card you don't have!");
                            }
                        }
                    });
                }
            } else {
                message.channel.send("You must be in a duel to use this command!");
            }
        });
        database.disconnect();
    }
}