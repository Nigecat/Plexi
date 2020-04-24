const sqlite3 = require("sqlite3").verbose();

module.exports = function(message, args) {
    if (message.member.hasPermission("ADMINISTRATOR")) {
        let database = new sqlite3.Database("./configuration/config.sqlite");
        database.run(`UPDATE Server SET prefix = '${args[0]}' WHERE id = ${message.guild.id}`);
        message.channel.send(`Server prefix updated to: \`${args[0]}\``);
        database.close();
    }
}