import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { Message, User } from "discord.js";

export default class CheckBal extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "checkbal",
            description: "Check another user's coin balance",
            group: "Economy",
            args: [
                {
                    type: "user",
                    name: "user",
                },
            ],
        });
    }

    async run(message: Message, [user]: [User]): Promise<void> {
        const { coins } = await this.client.database.getUser(user.id);
        message.channel.send(`${user} has ${coins} coins!`, { disableMentions: "everyone" });
    }
}
