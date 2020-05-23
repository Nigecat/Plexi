import Command from "../../util/Command.js";
import { Message, Client } from "discord.js";
import Database from "../../util/Database.js";
import { formatMarkdown } from "../../util/util.js";

export default Command.create({
    args: ["peanuts|coins"],
    description: "View the global top leaderboard for a property",
    async call (message: Message, args: string[], database: Database, client: Client): Promise<void> {
        const data: any = await database.getTop(args[0]);
        message.channel.send(formatMarkdown(
            [`# Top #10 global for ${args[0]}`].concat(
                await Promise.all(data.map(async (user: any, i: number): Promise<string> => 
                    `[${i}]    > ${(await client.users.fetch(user.id)).username}: ${user[args[0]]} ${args[0]}`
                ))
            )
        ));
    }
});