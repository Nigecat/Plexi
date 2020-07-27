const { owner } = require("../config/config.json");

module.exports = {
    options: {
        description: "Run sql",
        requirements: { userIDs: [owner] },
        argsRequired: true,
        fullDescription: "Execute an sql query in the database",
        hidden: true,
        usage: "<query>"
    },
    async call({ args, database }) {
        try {
            const res = await database.connection.all(args.join(" "));
            return "```\n" + JSON.stringify(res, null, 4) + "```"
        } catch {
            return "Something went wrong... Did you execute an invalid query?";
        }
    }        
}