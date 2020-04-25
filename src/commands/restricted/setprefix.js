const Database = require("../../database.js");
const Config = require("../../data/config.json");

module.exports = {
    args: ["<prefix>"],
    perms: ["ADMINISTRATOR"],
    call: function(message, args) {
        let database = new Database(Config.database, Config.default_prefix);
        database.updateServer(message.guild.id, "prefix", args[0]);
        message.channel.send(`Server prefix updated to: \`${args[0]}\``);
        database.disconnect();
    }
}