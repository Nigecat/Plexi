import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";

export default class BeepBoop extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "beepboop",
            group: "Fun",
            hidden: true,
            description: "beepboop",
        });
    }

    run(message: Message): void {
        message.channel.send("beepboop");
    }
}
