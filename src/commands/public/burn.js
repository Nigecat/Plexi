const Jimp = require("jimp");

function attachIsImage(msgAttach) {
    let url = msgAttach.url;
    // true if this url is a png or jpg image.
    return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1 || url.indexOf("jpg", url.length - "jpg".length /*or 3*/) !== -1;
}

module.exports = {
    args: [],
    perms: [],
    description: "Burn the previous message (as long as it is an image)",
    call: function(message) {
        message.channel.messages.fetch({ limit: 2 }).then(messages => {
            try {
                let image = messages.get(Array.from(messages.keys())[1]);
                if ((image.attachments.size > 0 && image.attachments.every(attachIsImage)) || image.embeds.length > 0) {
                    let url = image.embeds.length > 0 ? (image.embeds[0].url || image.embeds[0].image.url) : image.attachments.first().url;
                    url = url.includes("?size=") ? url.split("?size=").slice(0, -1).join("?size=") : url;
                    Jimp.read(url).then(image => {
                        image.pixelate(Math.floor(Math.random() * 2 + 2))
                            .posterize(3)
                            .contrast(0.75)
                            .write(`./commands/resources/temp/burn.png`)
                        message.channel.send({ files: [ "./commands/resources/temp/burn.png" ] });
                    });
                } else {
                    message.channel.send("Image not found!");
                }
            } catch (err) {
                message.channel.send("Image not found!");
            }
        });
    }
}