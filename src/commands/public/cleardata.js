const Database = require("../../database.js");
const Config = require("../../data/config.json");

module.exports = {
    args: [],
    perms: [],
    description: "Clear all stored data relating to the user that ran the command (THIS ACTION IS IRREVERSIBLE)",
    call: function(message) {
        const filter = (reaction, user) => {
            return ["✅", "❌"].includes(reaction.emoji.name) && user.id === message.author.id;
        };

        message.channel.send("Are you sure you want to do this? All stored data on you will be cleared (THIS ACTION IS IRREVERSIBLE)").then(confirm => {
            confirm.react("❌")
                .then(() => confirm.react("✅"))
                .then(() => {
                    confirm.awaitReactions(filter, { max: 1, time: 10000, errors: ["time"] }).then(reaction => {
                        confirm.delete();
                        if (reaction.first()._emoji.name == "✅") {
                            message.channel.send("Data cleared!");
                            let database = new Database(Config.database, Config.default_prefix);
                            database.addUser(message.author.id);
                            database.database.run(`DELETE FROM User WHERE id = ${message.author.id}`);
                            database.database.run(`DELETE FROM Game WHERE user1 = ${message.author.id} OR user2 = ${message.author.id}`);
                            database.disconnect();
                        } else {
                            message.channel.send("Operation cancelled!");
                        }
                    }).catch(() => {
                        confirm.delete();
                        message.channel.send("You took too long to react!");
                    });
                });
        });
    }
}