const { readdir, readdirSync } = require("fs");
const Database = require("../../database.js");
const Config = require("../../data/config.json");

module.exports = {
    args: `<${readdirSync("./commands/catrd/").map(file => file.split(".")[0]).join("|")}>`,
    perms: [],
    description: "Run catrd help <command> for more details\nTODO usage instructions",
    call: function(message, args) {
        let database = new Database(Config.database, Config.default_prefix);
        database.addUser(message.author.id);

        database.getServerInfo(message.guild.id, row => {   
            let state = !!row.catrd; // check if catrd is enabled on server (convert 0 or 1 to true/false)
            if (args.length == 0) { // if no command specified default to help
                args.push("help");
            }
            if (!state && args[0] != "enable") {
                message.channel.send("catrd is currently disabled on this server, get an admin to run `catrd enable` to start playing!");
            } else {
                readdir("./commands/catrd/", (err, files) => {
                    files.forEach(file => {
                        if (args[0] == file.split(".")[0] && file != "catrd.js") {
                            let data = require(`../catrd/${file}`);
                            let prefix = message.content.split("catrd")[0];
                            if (data.args.length == args.slice(1).length || (typeof data.args == "string" && args.slice(1).length > 0)) {   // verify the user has entered all the arguments  (or if the argument is a string the allow it)
                                data.call(message, args.slice(1));
                            } else {
                                if (typeof data.args == "string") {
                                    message.channel.send(`Command syntax error, expected syntax: \`${prefix}catrd ${args[0]} ${data.args}\``)
                                } else {
                                    message.channel.send(`Command syntax error, expected syntax: \`${prefix}catrd ${args[0]} ${data.args.join(" ")}\``)
                                }
                            }
                            delete require.cache[require.resolve(`../catrd/${file}`)];
                        }
                    });
                });
            }
        });
        database.disconnect();
    }
}
