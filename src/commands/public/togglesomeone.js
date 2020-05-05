const Database = require("../../database.js");
const Config = require("../../data/config.json");

module.exports = {
    args: [],
    perms: ["ADMINISTRATOR"],
    description: "When this is enabled, a user will be able to type @someone in their message to mention a random user",
    call: function(message) {
        let database = new Database(Config.database, Config.default_prefix);
        database.getServerInfo(message.guild.id, row => {
            database.updateServer(message.guild.id, "someone", !row.someone ? 1 : 0);
            message.channel.send(`@someone successfully set to ${!row.someone ? "enabled" : "disabled"}!`);
        });
        database.disconnect();
    }
}