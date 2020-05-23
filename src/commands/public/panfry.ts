import { Message } from "discord.js";
import { lastMessage, manipulateImage } from "../../util/util.js";
import Command from "../../util/Command.js";

export default <Command> {
    description: "Pan fry the previous message (as long as it is an image)",
    async call (message: Message): Promise<void> {
        const image = await lastMessage(message.channel);
        message.channel.send({ files: [ await manipulateImage(image, "panfry", 9, 0.3) ] });
    }
}