const Jimp = require("jimp");

function attachIsImage(msgAttach) {
    let url = msgAttach.url;
    // true if this url is a png or jpg image.
    return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1 || url.indexOf("jpg", url.length - "jpg".length /*or 3*/) !== -1;
}

module.exports = {
    args: [],
    perms: [],
    description: "Pan fry the previous message (as long as it is an image)",
    call: function(message) {
        message.channel.messages.fetch({ limit: 2 }).then(messages => {
            try {
                let image = messages.get(Array.from(messages.keys())[1]);
                if ((image.attachments.size > 0 && image.attachments.every(attachIsImage)) || image.embeds.length > 0) {
                    let url = image.embeds.length > 0 ? (image.embeds[0].url || image.embeds[0].image.url) : image.attachments.first().url;
                    url = url.includes("?size=") ? url.split("?size=").slice(0, -1).join("?size=") : url;
                    Jimp.read(url).then(image => {
                        image.posterize(9)
                            .contrast(0.3)
                            .write(`./commands/resources/temp/panfry.png`)
                        message.channel.send({ files: [ "./commands/resources/temp/panfry.png" ] });
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