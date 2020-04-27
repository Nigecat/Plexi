const Database = require("../../database.js");
const Config = require("../../data/config.json");

module.exports = {
    args: ["<@user>", "<coins>"],
    description: "Donate coins to (the poor) another user",
    call: function(message, args) {
        try {

        let database = new Database(Config.database, Config.default_prefix);
        if (message.mentions.members.first() != undefined) {
            database.addUser(message.mentions.members.first().id);
            if (!isNaN(args[1])) {
                args[1] = parseInt(args[1]);
                database.getUser(message.author.id, row => {
                    if (row.coins >= args[1]) {
                        database.getUser(message.mentions.members.first().id, row2 => {
                            database.updateUser(message.author.id, "coins", row.coins - args[1]);
                            database.updateUser(message.mentions.members.first().id, "coins", row2.coins + args[1]);
                            message.channel.send(`${args[1]} coins transfered from ${message.author} to ${message.mentions.members.first()}!`)
                        });
                    } else {
                        message.channel.send("You do not have enough coins to do that");
                    }
                });
            } else {
                message.channel.send("Invalid coin value");
            }
        } else {
            message.channel.send("Invalid user");
        }
        database.disconnect();

    } catch (err) {
        console.log(err)
    };
    }
}