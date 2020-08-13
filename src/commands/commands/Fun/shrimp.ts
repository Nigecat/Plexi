import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { MessageAttachment, Message } from "discord.js";

export default class Shrimp extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "shrimp",
            description: "Shrimp",
            group: "Fun",
            clientPermissions: ["ATTACH_FILES"],
            userPermissions: ["ATTACH_FILES"],
        });
    }

    run(message: Message): void {
        const attachment = new MessageAttachment("src/assets/shrimp.png");
        message.channel.send(attachment);
    }
}
