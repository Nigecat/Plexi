const { MessageEmbed } = require("discord.js");
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

async function getPower(database, card) {
    return new Promise((resolve, reject) => {
        database.database.get(`SELECT power FROM Card WHERE name = ?`, card, (err, row) => {
            resolve(row.power);
        });
    });
}


// returns either user1 or user2 or draw for whoever wins the given round
async function calculateWinner(database, user1, user2) {
    user1 = user1.map(w => capitalizeFirstLetter(w));
    user2 = user2.map(w => capitalizeFirstLetter(w));
    let user1total = 0;
    let user2total = 0;

    for (const card of user1) {
        let power = await getPower(database, card);
        user1total += power;
    }

    for (const card of user2) {
        let power = await getPower(database, card);
        user2total += power;
    }

    // calculate which user is the winner
    return [user1total > user2total ? "user1" : user2total > user1total ? "user2" : "draw", user1total, user2total];
}

module.exports = {
    args: [],
    description: "End your turn for the rest of the round",
    call: function(message) {
        let database = new Database(Config.database, Config.default_prefix);
        database.checkExpire(message.author.id);     
        database.inMatch(message.author.id).then(match => {
            if (match) {
                database.getGame(message.author.id, row => {
                    let user = row.user1 == message.author.id ? "user1" : "user2";
                    if (!row[`${user}pass`]) {  // if user hasn't already passed
                        database.updateGame(message.author.id, "pass", 1, async () => {
                            if (!!row[`${user == "user1" ? "user2" : "user1"}pass`]) {    // if the other user has passed
                                let user1active = JSON.parse(row.user1active);
                                let user2active = JSON.parse(row.user2active);
                                database.updateGameVal(message.author.id, "user1active", "[]");
                                database.updateGameVal(message.author.id, "user2active", "[]");
                                database.updateGameVal(message.author.id, "user1pass", 0);
                                database.updateGameVal(message.author.id, "user2pass", 0);
                                database.updateGameVal(message.author.id, "round", row.round + 1);
                                let winner = await calculateWinner(database, user1active, user2active);
                                let embed = new MessageEmbed().setColor([255, 0, 0]);

                                if (winner[0] == "draw") {
                                    embed.setTitle(`Both users have the same power level (${winner[1]})! This round is a draw.`);
                                    row.user1wins += 1;
                                    row.user2wins += 1;
                                    database.updateGameVal(message.author.id, "user1wins", row.user1wins);
                                    database.updateGameVal(message.author.id, "user2wins", row.user2wins);
                                } else {
                                    embed.setTitle(`${row[`${winner[0]}tag`]} has won the round!`);
                                    row[`${winner[0]}wins`] += 1;
                                    database.updateGameVal(message.author.id, `${winner[0]}wins`, row[`${winner[0]}wins`] + 1);
                                    embed.addField("Current round wins", `${row.user1tag}: ${row.user1wins}\n${row.user2tag}: ${row.user2wins}`);
                                    embed.setFooter("(first to 2 wins will win the duel)");
                                }

                                if (row.user1wins >= 2 || row.user2wins >= 2) {  // game over
                                    if (winner[0] != "draw") {
                                        let bet = row[`${winner[0] == "user1" ? "user2" : "user1"}bet`];
                                        let user2 = winner[0];
                                        user = user2 == "user1" ? "user2" : "user1";
                                        if (!isNaN(bet)) {   // coin bet
                                            bet = parseInt(bet);
                                            database.getUser(row[user], row1 => {
                                                database.updateUser(row[user], "coins", row1.coins - bet > 0 ? row1.coins - bet : 0);
                                                database.getUser(row[user2], row2 => {
                                                    database.updateUser(row[user2], "coins", row2.coins + bet);
                                                    deleteGame(row[user], database);
                                                });
                                                message.channel.send(`${row[`${user}tag`]} has lost the duel to ${row[`${user2}tag`]}, the winner will now recieve ${bet} coins.`);
                                            });
                                        } else {    // card bet
                                            bet = bet.split(" ").map(w => capitalizeFirstLetter(w)).join(" ");
                                            database.getUser(row[user], row1 => {
                                                database.getUser(row[user2], row2 => {
                                                    database.updateUser(row[user], "cards", JSON.stringify(remove(JSON.parse(row1.cards), bet)));
                                                    database.updateUser(row[user2], "cards", JSON.stringify(JSON.parse(row2.cards).concat([bet])));
                                                    deleteGame(row[user], database);
                                                });
                                            });
                                            message.channel.send(`${row[`${user}tag`]} has lost the duel to ${row[`${user2}tag`]}, the winner will now recieve ${bet}.`);
                                        }
                                    } else {
                                        message.channel.send("The duel is now over, it was a draw.");
                                        deleteGame(row.user1, database);
                                    }
                                } else {
                                    message.channel.send({embed});
                                }

                            } else {
                                message.channel.send(`${message.author} has now passed, waiting on opponent to pass`);
                            }
                        });
                    } else {
                        message.channel.send("You have already passed! Please wait for your opponent to pass.");
                    }
                });
            } else {
                message.channel.send("Duel cancelled.");
            }
        });
    }
}