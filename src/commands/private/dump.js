const { readdir } = require("fs");
let { MessageEmbed } = require("discord.js");

function clearCache(file) {
    delete require.cache[require.resolve(file)];
}

function splitStrDiscordReply(str) {
    return str.match(/[\s\S]{1,1000}/g) || [];
}

module.exports = function(message) {
    readdir("./commands/public/", (err, files) => {
        let prefix = message.content.split("dump")[0];
        let embed = new MessageEmbed().setTitle("Command Dump (formatted for top.gg)").setColor("FFD300");
        let dump = [];
        files.forEach(file => {
            let data = require(`../public/${file}`);
            dump.push(`${prefix}${file.split(".").slice(0, -1)} ${typeof data.args == "string" ? data.args : data.args.join(" ")} - ${data.description}`);
            clearCache(`../public/${file}`);
        });

        dump = splitStrDiscordReply(dump.join("\n").replace(/</g, "\\\\<"));
        dump.forEach(l => {
            embed.addField("‎", l);
        });

        message.channel.send({embed, split: true});
    });
}