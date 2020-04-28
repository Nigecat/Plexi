const Database = require("../../database.js");
const Config = require("../../data/config.json");

module.exports = {
    args: [],
    description: "Collection 50 coins, can only be run once per day",
    call: function (message, args) {
        let database = new Database(Config.database, Config.default_prefix);
        database.getUser(message.author.id, row => {
            let time = Date.now();
            if (row.dailyClaimTime == null || ((time - row.dailyClaimTime) / 3600000) >= 24) {
                message.channel.send(`You have claimed your daily coins!\nYou now have ${row.coins + 50} coins`);
                database.updateUser(message.author.id, "coins", row.coins + 50);
                database.updateUser(message.author.id, "dailyClaimTime", Date.now());
            } else {
                message.channel.send(`Please wait ${24 - Math.trunc((time - row.dailyClaimTime) / 3600000)} hours before you can claim your daily coins`);
            }
        });
        database.disconnect();
    }
}