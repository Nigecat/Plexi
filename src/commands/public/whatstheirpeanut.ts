import { Message } from "discord.js";
import Database from "../../util/Database.js";
import User from "../../util/User.js";
import Command from "../../util/Command.js";

export default <Command> {
    args: ["@user"],
    description: "Check your peanut level",
    async call (message: Message, args: string[], database: Database): Promise<void> {
        const user: User = new User(message.mentions.users.first().id, database);
        await user.init();
        message.channel.send(`${message.mentions.users.first()}'s peanut meter level is currently at ${user.peanuts}!`);
        message.channel.send("`Calculated with peanut algorithm™`");
    }
}