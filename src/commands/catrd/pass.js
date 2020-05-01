const Database = require("../../database.js");
const Config = require("../../data/config.json");

module.exports = {
    args: [],
    description: "End your turn for the rest of the round TODO",
    call: function(message) {
        let database = new Database(Config.database, Config.default_prefix);
        database.checkExpire(message.author.id);     
        database.inMatch(message.author.id).then(match => {
            if (match) {

            } else {
                message.channel.send("Duel cancelled.");
            }
        });
    }
}