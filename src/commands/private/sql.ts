import { Message } from "discord.js";
import Database from "../../util/Database";

export default async function (message: Message, database: Database): Promise<void> {
    const query: string = message.content.split(" ").slice(1).join(" ");
    if (query.toUpperCase().includes("SELECT")) {
        database.get(query).then(rows => {
            message.channel.send(`Executing query \`${query}\`\n\`${JSON.stringify(rows, null, 2)}\``);
        }).catch(err => {
            message.channel.send(`Database responded with error: \`${err}\``);
        });
    } else {
        database.run(query);
    }
}   