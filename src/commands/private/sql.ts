import { CommandData } from "../../types.js";

export default async function({ message, args, database }: CommandData) {
    database.connection.all(args.join(" "), (err, rows) => {
        message.channel.send("```\n" + JSON.stringify(rows, null, 4) + "```");
    });
}