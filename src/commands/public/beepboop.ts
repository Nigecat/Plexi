import { Message } from "discord.js";

export default {
    description: "beepboop",
    call: function(message: Message): void {
        message.channel.send("beepboop");
    }
}