const { readdir, readdirSync } = require("fs");
const { MessageEmbed } = require("discord.js");

module.exports = {
    args: "<command>",
    description: "Catrd help and instruction page",
    call: function(message, args) {
        readdir("./commands/catrd/", (err, files) => {
            let prefix = message.content.split("catrd")[0];
            
            if (args.length > 0) {
                let file = args[0];
                let data = require(`../catrd/${file}.js`);
                if (typeof data.args == "string") {
                    data.args = [data.args];
                }
                message.channel.send(`\`\`\`markdown\n# Command\n${prefix}${file.split(".")[0]} ${data.args.join(" ")}\n\n# Description\n${data.description}\`\`\``);
                delete require.cache[require.resolve(`../catrd/${args[0]}.js`)];

            } else {
                const embed = new MessageEmbed()
                    .setColor([114, 137, 218])
                    .setAuthor(`This server's prefix is currently: ${prefix}`)
                    .setTimestamp(new Date())
                    .setTitle("catrd - a card game but with cats!");
                
                let commands = [];
                readdirSync("./commands/catrd/").forEach(file => {
                    commands.push(`${prefix}catrd ${file.split(".")[0]}`);
                });
                embed.addField(`(use ${prefix}catrd help <command> to get more details on a command)`, commands.join("\n"));
                embed.addField("TODO: Usage description", "‎");

                message.channel.send({embed});
            }
        });
    }
}