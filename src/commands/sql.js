const { owner } = require("../config/config.json");

module.exports = {
    options: {
        description: "Execute an sql query in the database",
        requirements: { userIDs: [owner] }
    },
    async call({ message, args, database, client }) {

    }        
}