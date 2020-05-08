const Database = require("../../database.js");
const Config = require("../../data/config.json");

module.exports = {
    args: "<set|clear> <@role>",
    perms: ["ADMINISTRATOR"],
    description: "Assign a role to be automatically added to a user when they join this server",
    call: function(message, args) {
        if (args[0] == "clear") {
            let database = new Database(Config.database, Config.default_prefix);
            message.channel.send("Autorole cleared!");
            database.database.run(`UPDATE Server SET autorole = NULL WHERE id = ${message.guild.id}`);
            database.disconnect();

        } else if (args[0] == "set" && message.mentions.roles) {
            let database = new Database(Config.database, Config.default_prefix);
            message.channel.send("Autorole set!");
            database.database.run(`UPDATE Server SET autorole = ? WHERE id = ${message.guild.id}`, message.mentions.roles.first().id);
            database.disconnect();

        } else {
            message.channel.send(`Command syntax error, expected syntax: \`${message.content.split("autorole")[0]}autorole <set|clear> <@role>\``);
        }
    }
}