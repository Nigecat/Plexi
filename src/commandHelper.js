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
                        require(`./commands/public/${file}`)(message, args);
                    }
                });
            });

            

        }
    });
}