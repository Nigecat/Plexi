const Database = require("../../database.js");
const Config = require("../../data/config.json");

module.exports = {
    args: ["<rock|paper|scissors>", "<coins>"],
    description: "Gamble your coins in a rock paper scissors game against the bot! If you lose the game you lose all betted coins, if you win they get doubled. A tie results in nothing.",
    call: function (message, args) {
        const choices = ["rock", "paper", "scissors"];

        if (choices.includes(args[0])) {
            if (!isNaN(args[1])) {
                args[1] = parseInt(args[1]);
                let database = new Database(Config.database, Config.default_prefix);
                database.getUser(message.author.id, row => {
                    if (row.coins >= args[1]) {
                        switch (Math.floor((Math.random() * 3) + 1)) {
                            case 1: {
                                message.channel.send(`You just won ${args[1]} coins! You now have ${row.coins + args[1]} coins.`);
                                database.updateUser(message.author.id, "coins", row.coins + args[1]);
                                break;
                            }
                            case 2: {
                                message.channel.send(`You have lost ${args[1]} coins, you now have ${row.coins - args[1]} coins.`);
                                database.updateUser(message.author.id, "coins", row.coins - args[1]);
                                break;
                            }
                            case 3: {
                                message.channel.send("It's a tie, nothing happened.");
                                break;
                            }
                        }
                    } else {
                        message.channel.send("You do not have enough coins to do that");
                    }
                });
                database.disconnect();
            } else {
                message.channel.send("Invalid coin value");
            }
        } else {
            message.channel.send("Invalid action");
        }
    }
}