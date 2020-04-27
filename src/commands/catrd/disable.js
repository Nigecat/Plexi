const Database = require("../../database.js");
const Config = require("../../data/config.json");

module.exports = {
    args: [],
    description: "Disable catrd for this server",
    call: function(message, args) {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            let database = new Database(Config.database, Config.default_prefix);
            database.updateServer(message.guild.id, "catrd", 0);
            message.channel.send(`**catrd disabled!**`);
            database.disconnect();
        } else {
            message.channel.send("Only an admin can run this command!");
        }
    }
}