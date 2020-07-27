import config from "../config/config.json";
import { Command, CommandData } from "../types.js";

export default {
    options: {
        description: "Run sql",
        fullDescription: "Execute an sql query in the database",
        requirements: { userIDs: [config.owner] },
        argsRequired: true,
        hidden: true,
        usage: "<query>"        
    },
    call: async ({ args, database }: CommandData) => {
        try {
            const res = await database.executeSql(args.join(" "));
            return "```\n" + JSON.stringify(res, null, 4) + "```";
        } catch {
            return "Something went wrong... You probably entered an invalid query."
        }
    } 
} as Command