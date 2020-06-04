import Command from "../../util/Command.js";
import { Message } from "discord.js";
import User from "../../util/User.js";
import Database from "../../util/Database.js";

export default Command.create({
    description: "Claim 50 daily catrd coins",
    async call (message: Message, args: string, database: Database): Promise<void> {
        const user: User = new User(message.author.id, database);
        const now: number = +new Date();
        await user.init();

        if (user.dailyclaimtime === null || (now - Number(user.dailyclaimtime)) > 8.64e+7) {
            user.update("coins", (Number(user.coins) + 50).toString());
            user.update("dailyclaimtime", (+new Date()).toString());
            message.channel.send(`You have claimed your 50 daily coins, You now have ${user.coins} coins!`);
        } else {
            message.channel.send(`You have already claimed your daily coins! Please wait ${Math.round((8.64e+7 - (now - Number(user.dailyclaimtime))) / 3.6e+6 * 100) / 100} hours before claiming again.`);
        }
    }
});