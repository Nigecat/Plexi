const { access } = require("fs");
const { MessageEmbed } = require("discord.js");

module.exports = {
    args: "<command>",
    description: "Catrd help and instruction page",
    call: function(message, args) {
        let prefix = message.content.split("catrd")[0];
        let file = args[0];
        access(`./commands/catrd/${file}.js`, err => {
            if (!err) {
                let data = require(`../catrd/${file}.js`);
                if (typeof data.args == "string") {
                    data.args = [data.args];
                }
                message.channel.send(`\`\`\`markdown\n# Command\n${prefix}catrd ${file.split(".")[0]} ${data.args.join(" ")}\n\n# Description\n${data.description}\`\`\``);
                delete require.cache[require.resolve(`../catrd/${args[0]}.js`)];
            } else {console.log(err)}
        });
    }
}