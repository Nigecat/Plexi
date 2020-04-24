const sqlite3 = require("sqlite3").verbose();

module.exports = function(message, query) {
    query = query.join(" ");
    let database = new sqlite3.Database("./configuration/config.sqlite");
    database.all(query, (err, rows) => {
        message.channel.send(`Executing query \`${query}\`\nResponse: \n\`${JSON.stringify(rows, null, 2)}\``);
    });
    database.close();
}
