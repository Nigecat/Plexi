import Command from "../../util/Command.js";
import { Message, Client } from "discord.js";
import Database from "../../util/Database.js";
import { formatMarkdown } from "../../util/util.js";

export default Command.create({
    description: "View the global top leaderboard for peanuts",
    async call (message: Message, args: string[], database: Database, client: Client): Promise<void> {
        const data: any = await database.getTop("peanuts");
        message.channel.send(formatMarkdown(
            [`# Top #10 global for peanuts`].concat(
                await Promise.all(data.map(async (user: any, i: number): Promise<string> => 
                    `[${i}]    > ${(await client.users.fetch(user.id)).username}: ${user.peanuts} ${"peanuts"}`
                ))
            )
        ));
    }
});