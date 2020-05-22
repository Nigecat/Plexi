import { Message } from "discord.js";
import { lastMessage, manipulateImage } from "../../util/util.js";

export default {
    description: "Literally just completely chars the previous message (as long as it is an image)",
    async call (message: Message): Promise<void> {
        const image = await lastMessage(message.channel);
        message.channel.send({ files: [ await manipulateImage(image, "char", 1, 0.75) ] });
    }
}