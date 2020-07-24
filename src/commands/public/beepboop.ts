import { Command, CommandData } from "../../types.js";

export default {
    description: "beepboop",
    call({ message }: CommandData) {
        message.channel.send("beepboop");
    }
} as Command
