const Database = require("../../database.js");
const Config = require("../../data/config.json");

module.exports = function(message, query) {

    query = query.join(" ");
    let database = new Database(Config.database, Config.default_prefix);
    database.database.all(query, (err, rows) => {
        message.channel.send(`Executing query \`${query}\`\nResponse: \n\`${JSON.stringify(rows, null, 2)}\``);
    });
    database.disconnect();
}
