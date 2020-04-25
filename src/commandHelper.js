const { readdir, readdirSync } = require("fs");
const { MessageEmbed } = require("discord.js");

module.exports = async function(message, database, client) {
    database.getServerInfo(message.guild.id, row => {       // get prefix for server
        const prefix = row.prefix;

        if (message.content == "$help" || message.content == `${prefix}help`) {
            // create custom message embed for help command
            const embed = new MessageEmbed()
                .setColor([114, 137, 218])
                .setAuthor(client.user.username, client.user.avatarURL())
                .setTimestamp(new Date())
                .setFooter("v" + require("./package.json").version)
                .setTitle(`This server's prefix is currently: ${prefix}`)

            // loop through each command and append the required information to the embed
            readdirSync("./commands/public").forEach(file => {
                let data = require(`./commands/public/${file}`);
                if (typeof data.args == "string") {
                    let temp = data.args;
                    data.args = [];
                    data.args.push(temp);
                }
                if (data.perms.length > 0) {    // check if command has any perms and change what is displayed
                    embed.addField(`${prefix}${file.split(".")[0]} ${data.args.join(" ")}`, `${data.description} | Perms: ${data.perms.join(" ")}`);
                } else {
                    embed.addField(`${prefix}${file.split(".")[0]} ${data.args.join(" ")}`, data.description);
                }
            });

            message.channel.send({embed});

        } else if (message.content.startsWith(prefix)) {
            let command = message.content.split(prefix)[1].replace(/ .*/,'').toLowerCase();   // extract command
            let args = message.content.split(" ").slice(1);         // extract args

            // looop through each command
            readdir("./commands/public", (err, files) => {
                files.forEach(file => {
                    if (file.split(".")[0] == command) { // check if file matches the user's command
                        let data = require(`./commands/public/${file}`);    
                        if (message.member.hasPermission(data.perms)) { // verify the user has the correct permissions
                            if (data.args.length == args.length || typeof data.args == "string") {    // verify the user has entered all the arguments  (or if the argument is a string the allow it)
                                data.call(message, args);
                            } else {
                                message.channel.send(`Command syntax error, expected syntax: \`${prefix}${command} ${data.args.join(" ")}\``)
                            }
                        } else {
                            message.channel.send(`It appears you are missing the permission(s) \`${data.perms.join(" ")}\` to run this command`)
                        }
                        // delete the file cache so the commands can be updated without stopping the bot
                        delete require.cache[require.resolve(`./commands/public/${file}`)];
                    }
                });
            });

            if (message.author.id == "307429254017056769") {  // only run these commands for bot owneer
                readdir("./commands/private", (err, files) => {
                    files.forEach(file => {
                        if (file.split(".")[0] == command) {
                            require(`./commands/private/${file}`)(message, args);
                        }
                    });
                });
            }
        }
    });
}