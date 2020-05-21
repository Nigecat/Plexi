import { Message } from "discord.js";

export default {
    description: "beepboop",
    call (message: Message): void {
        message.channel.send("beepboop");
    }
}