import { Message } from "discord.js";
import { lastMessage, attachIsImage } from "../../util/util.js";
import Jimp from "jimp";

export default {
    description: "Burn the previous message (as long as it is an image)",
    async call (message: Message): Promise<void> {
        const image = await lastMessage(message.channel);
        if ((image.attachments.size > 0 && image.attachments.every(attachIsImage)) || image.embeds.length > 0) {
            let url = image.embeds.length > 0 ? (image.embeds[0].url || image.embeds[0].image.url) : image.attachments.first().url;
            url = url.includes("?size=") ? url.split("?size=").slice(0, -1).join("?size=") : url;

            const blob: Jimp = await Jimp.read(url);
            blob.pixelate(Math.floor(Math.random() * 2 + 2))
                .posterize(3)
                .contrast(0.75)
                .write(`./commands/resources/temp/burn.png`);

                message.channel.send({ files: [ "./commands/resources/temp/burn.png" ] });

        } else {
            message.channel.send("Image not found!");
        }
    }
}