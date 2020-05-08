const Database = require("../../database.js");
const Config = require("../../data/config.json");

function remove(arr, text) {
    arr.splice(arr.indexOf(text), 1);
    return arr;
}

function capitalizeFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
}

function deleteGame(id, database) {
    database.database.get(`SELECT * FROM Game WHERE user1 = ${id} OR user2 = ${id} LIMIT 1`, (err, row) => {
        database.database.run(`DELETE FROM Game WHERE user1 = ${row.user1} AND user2 = ${row.user2}`);
    }); 
}

module.exports = {
    args: [],
    description: "Forfeit the game, the other user will win the bet",
    call: function(message) {
        let database = new Database(Config.database, Config.default_prefix);
        database.checkExpire(message.author.id);     
        database.inMatch(message.author.id).then(match => {
            if (match) {
                database.getGame(message.author.id, row => {
                    let user = row.user1 == message.author.id ? "user1" : "user2"; 
                    let user2 = user == "user1" ? "user2" : "user1";
                    if (row.round > 0) {
                        let bet = row[`${user}bet`];
                        database.addUser(row[user]);
                        database.addUser(row[user2]);
                        if (!isNaN(bet)) {   // coin bet
                            bet = parseInt(bet);
                            database.getUser(row[user], row1 => {
                                database.updateUser(row[user], "coins", row1.coins - bet > 0 ? row1.coins - bet : 0);
                                database.getUser(row[user2], row2 => {
                                    database.updateUser(row[user2], "coins", row2.coins + bet);
                                    deleteGame(row[user], database);
                                });
                                message.channel.send(`${message.author} has forfeited the game against ${row[`${user == "user1" ? "user2" : "user1"}tag`]}, they will now recieve ${bet} coins.`);
                            });
                        } else {    // card bet
                            bet = bet.split(" ").map(w => capitalizeFirstLetter(w)).join(" ").split("-").map(w => capitalizeFirstLetter(w)).join("-");
                            database.getUser(row[user], row1 => {
                                database.getUser(row[user2], row2 => {
                                    database.updateUser(row[user], "cards", JSON.stringify(remove(JSON.parse(row1.cards), bet)));
                                    database.updateUser(row[user2], "cards", JSON.stringify(JSON.parse(row2.cards).concat([bet])));
                                    deleteGame(row[user], database);
                                });
                            });
                            message.channel.send(`${message.author} has forfeited the game against ${row[`${user == "user1" ? "user2" : "user1"}tag`]}, they will now recieve ${bet}.`);
                        }
                    } else {
                        deleteGame(row[user], database);
                        message.channel.send("Duel cancelled.");
                    }
                });
            } else {
                message.channel.send("You must be in a duel to run that command!");
            }
        });
        database.disconnect();
    }
}