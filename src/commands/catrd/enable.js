const Database = require("../../database.js");
const Config = require("../../data/config.json");

module.exports = {
    args: [],
    description: "Enable catrd for this server (it's on by default)",
    call: function(message, args) {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            let database = new Database(Config.database, Config.default_prefix);
            database.updateServer(message.guild.id, "catrd", 1);
            message.channel.send(`**catrd enabled!**`);
            database.disconnect();
        } else {
            message.channel.send("Only an admin can run this command!");
        }
    }
}