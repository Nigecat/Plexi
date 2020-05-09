const Database = require("../../database.js");
const Config = require("../../data/config.json");

// get the second last message of a channel
function secondLast(channel) {
    return new Promise(resolve => {
        channel.messages.fetch({ limit: 2 }).then(messages => {
            resolve(messages.last());
        });
    });
}

module.exports = {
    args: "<add|remove|clear|clearall> <:emoji:> <@role>",
    perms: ["ADMINISTRATOR"],
    description: "Set the role reactions for the previous message, all commands will apply to the previous message in the channel that it is run in. (apart from clearall, which will clear ALL reaction roles in that server)",
    call: function(message, args) {
        let database = new Database(Config.database, Config.default_prefix);
        if (args[0] == "add" && args.length == 3 && message.mentions.roles.size > 0) {
            secondLast(message.channel).then(prev => {
                prev.react(args[1]);
                database.getServerInfo(prev.guild.id, row => {
                    let data = JSON.parse(row.rolereact);
                    let id = prev.id.toString();

                    if (!data.hasOwnProperty(id)) {
                        let temp = {};
                        temp[args[1]] = message.mentions.roles.first().id;
                        data[id] = temp;
                    } else {
                        data[id][args[1]] = message.mentions.roles.first().id;
                    }

                    database.updateServer(message.guild.id, "rolereact", JSON.stringify(data));
                });

                database.disconnect();
                message.delete();
            });

        } else if (args[0] == "remove" && args.length > 1) {
            secondLast(message.channel).then(prev => {
                prev.reactions.cache.get(args[1]).remove();
                database.getServerInfo(prev.guild.id, row => {
                    let data = JSON.parse(row.rolereact);
                    let id = prev.id.toString();
                    delete data[id][args[1]];
                    database.updateServer(message.guild.id, "rolereact", JSON.stringify(data));
                });
                message.delete();
                database.disconnect();
            });

        } else if (args[0] == "clear") {
            secondLast(message.channel).then(prev => {
                prev.reactions.removeAll();
                database.getServerInfo(prev.guild.id, row => {
                    let data = JSON.parse(row.rolereact);
                    let id = prev.id.toString();
                    delete data[id];
                    database.updateServer(message.guild.id, "rolereact", JSON.stringify(data));
                });
                message.delete();
                database.disconnect();
            });


        } else if (args[0] == "clearall") {
            message.channel.send("Role reacts cleared!");
            database.updateServer(message.guild.id, "rolereact", "{}");
            database.disconnect();

        } else {
            message.channel.send(`Command syntax error, expected syntax: \`${message.content.split("rolereact")[0]}rolereact <add|remove|clear|clearall> <:emoji:> <@role>\``);
            database.disconnect();
        }
    }
}