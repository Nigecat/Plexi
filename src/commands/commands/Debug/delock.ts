import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { Message, User } from "discord.js";

export default class DeLock extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "delock",
            group: "Debug",
            description: "Unlock a user account",
            hidden: true,
            ownerOwnly: true,
            args: [
                {
                    name: "user",
                    type: "user",
                },
            ],
        });
    }

    run(message: Message, [user]: [User]): void {
        this.client.database.updateUser(user.id, "lock", false);
        message.react(["👍", "👌"][Math.floor(Math.random() * 2)]);
    }
}
