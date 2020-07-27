const { owner } = require("../config/config.json");

module.exports = {
    options: {
        description: "Execute an sql query in the database",
        requirements: { roleIDs: [owner] }
    },
    call({ message, args, database, client }) {
        console.log(database);
    }        
}