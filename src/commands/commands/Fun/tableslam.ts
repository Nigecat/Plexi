import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { MessageAttachment, Message } from "discord.js";

export default class TableSlam extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "tableslam",
            description: "Slam someone against a table",
            group: "Fun",
            clientPermissions: ["ATTACH_FILES"],
            userPermissions: ["ATTACH_FILES"],
        });
    }

    run(message: Message): void {
        const attachment = new MessageAttachment("src/assets/tableslam.png");
        message.channel.send(attachment);
    }
}
