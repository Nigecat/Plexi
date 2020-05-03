const Database = require("../../database.js");
const Config = require("../../data/config.json");

function capitalizeFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
}

function remove(arr, text) {
    arr.splice(arr.indexOf(text), 1);
    return arr;
}

module.exports = {
    args: "<card>",
    description: "Play a card from your hand onto the board",
    call: function(message, args) {
        let database = new Database(Config.database, Config.default_prefix);
        database.checkExpire(message.author.id);
        database.inMatch(message.author.id).then(match => {
            if (match) {
                database.getGame(message.author.id, row => {
                    if (row.round > 0) {
                        let user = row.user1 == message.author.id ? "user1" : "user2"; 
                        if (row.turn == user) {
                            if (args[args.length - 2] == "(alt") {
                                args[args.length - 2] = "(Alt";
                            }
                            args = args.map(w => capitalizeFirstLetter(w)).join(" ");
                            if (row.turn == user && row[`${user}hand`].includes(args)) {
                                database.updateGame(message.author.id, `hand`, JSON.stringify(remove(JSON.parse(row[`${user}hand`]), args)));
                                database.updateGame(message.author.id, `active`, JSON.stringify(JSON.parse(row[`${user}active`]).concat([args])));
                                database.updateGameVal(message.author.id, "turn", !row[`${user == "user1" ? "user2" : "user1"}pass`] ? user == "user1" ? "user2" : "user1" : user );
                                database.updateGame(message.author.id, `timeout`, Date.now() + Config.catrdTimeout);
                                message.channel.send(`${message.author} has played ${args}!`);
                            } else {
                                message.channel.send("You can't play a card not in your hand!");
                            }
                        } else {
                            message.channel.send("You can only run this command when it is your turn! Wait for the other user to play their card.");
                        }
                    } else {
                        message.channel.send("Both users of the duel most confirm the bet before you can play a card");
                    }
                });
            } else {
                message.channel.send("You must be in a duel to run this!");     
            }
        });
        database.disconnect();
    }
}