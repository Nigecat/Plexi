import Command from "../../util/Command.js";
import { Message } from "discord.js";
import User from "../../util/User.js";
import Database from "../../util/Database.js";

export default Command.create({
    description: "Check your coin balance",
    async call (message: Message, args: string, database: Database): Promise<void> {
        const user: User = new User(message.author.id, database);
        await user.init();
        message.channel.send(`You have ${user.coins} coins!`);
    }
});