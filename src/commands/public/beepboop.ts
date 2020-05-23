import { Message } from "discord.js";
import Command from "../../util/Command.js";

export default <Command> {
    description: "beepboop",
    call (message: Message): void {
        message.channel.send("beepboop");
    }
}