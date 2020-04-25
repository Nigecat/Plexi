const { readdir } = require("fs");

module.exports = async function(message, database) {
    database.getServerInfo(message.guild.id, row => {
        const prefix = row.prefix;

        if (message.content == "$help" || message.content == `${prefix}help`) {
            message.reply("beep boop how about no (im updating the bot try again later).");

        } else if (message.content.startsWith(prefix)) {
            let command = message.content.split(prefix)[1].replace(/ .*/,'').toLowerCase();   // extract command
            let args = message.content.split(" ").slice(1);         // extract args

            readdir("./commands/public", (err, files) => {
                files.forEach(file => {
                    if (file.split(".")[0] == command) {
                        let data = require(`./commands/public/${file}`);
                        if (data.args.length == args.length) {
                            data.call(message, args);
                        } else {
                            message.channel.send(`Command syntax error, expected syntax: \`${prefix}${command} ${data.args.join(" ")}\``)
                        }
                    }
                });
            });

            readdir("./commands/restricted", (err, files) => {
                files.forEach(file => {
                    if (file.split(".")[0] == command) {
                        let data = require(`./commands/restricted/${file}`);
                        if (message.member.hasPermission(data.perms)) {
                            if (data.args.length == args.length) {
                                data.call(message, args);
                            } else {
                                message.channel.send(`Command syntax error, expected syntax: \`${prefix}${command} ${data.args.join(" ")}\``)
                            }
                        } else {
                            message.channel.send(`It appears you are missing the permission(s) \`${data.perms.join(" ")}\` to run this command`)
                        }
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