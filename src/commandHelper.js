const { readdir, readdirSync, access } = require("fs");
const { MessageEmbed } = require("discord.js");

module.exports = async function(message, database, client) {
    message.content = message.content.toLowerCase();
    database.getServerInfo(message.guild.id, row => {       // get prefix for server
        const prefix = row.prefix;

        if (message.content.toLowerCase().includes("peanut")) {
            database.addUser(message.author.id);
            database.getUser(message.author.id, row => {
                database.updateUser(message.author.id, "peanuts", row.peanuts + (message.content.toLowerCase().match(/peanut/g) || []).length);
            });
        }

        // custom code for 264163117078937601 (Pinpointpotato#9418) AKA the ideas man
        if (message.author.id == "264163117078937601" && message.content.toLowerCase().includes("you know why they call me the ideas man")) {
            message.channel.send("cuz i CLEEEEEEAaaan up");
        } 

        // literally just pseudo-nitro (since bots can use emotes like how nitro does)
        else if (message.content.startsWith("g`")) {
            message.content = message.content.slice(2);
            let emojis = client.emojis.cache.map(x => [x.name, x]);
            emojis = emojis.filter(emoji => emoji[0].toLowerCase() == message.content.toLowerCase());
            if (emojis.length > 0) {
                let embed = new MessageEmbed()
                    .setImage(`https://cdn.discordapp.com/emojis/${emojis[0][1].id}`)
                    .setFooter(message.author.tag);
                message.channel.send({embed});
                message.delete();
            }
        }
        
        else if (message.content == "$help" || message.content == `${prefix}help`) {
            // create custom message embed for help command
            const embed = new MessageEmbed()
                .setColor([114, 137, 218])
                .setAuthor(client.user.username, client.user.avatarURL())
                .setTimestamp(new Date())
                .setFooter("v" + require("./package.json").version)
                .setTitle(`This server's prefix is currently: ${prefix}`)

            // loop through each command and append the required information to the embed
            let commands = [];
            readdirSync("./commands/public").forEach(file => {
                commands.push(`${prefix}${file.split(".")[0]}`);
            });
            embed.addField(`(use ${prefix}help <command> to get more details on a command, run ${prefix}setprefix to change the server prefix, run $catrd help for more details on the card game)`, commands.join("\n"));

           message.channel.send({embed});

        } else if (message.content.startsWith("$help") || message.content.startsWith(`${prefix}help`)) {
            readdirSync("./commands/public").forEach(file => {
                file = file.split(".")[0];
                if (file == message.content.split(" ")[1]) {
                    let data = require(`./commands/public/${file}`);
                    if (typeof data.args == "string") {
                        data.args = [data.args];
                    }
                    if (data.perms.length > 0) {
                        message.channel.send(`\`\`\`markdown\n# Command\n${prefix}${file.split(".")[0]} ${data.args.join(" ")}\n\n# Description\n${data.description}\n\n# Required Permissions\n${data.perms.join(", ")}\`\`\``);
                    } else {
                        message.channel.send(`\`\`\`markdown\n# Command\n${prefix}${file.split(".")[0]} ${data.args.join(" ")}\n\n# Description\n${data.description}\`\`\``);
                    }
                    delete require.cache[require.resolve(`./commands/public/${file}`)];
                }
            });

        } else if (message.content.startsWith(prefix)) {
            let override = message.content.startsWith(`${prefix}override`) && message.author.id == "307429254017056769";    // if starts with override and from owner
            let args = message.content.split(" ").slice(1);
            let command = override? args[0].toLowerCase() : message.content.split(prefix)[1].replace(/ .*/,'').toLowerCase();  // get the correct part of the string depending on if override enabled (removes the word 'override')
            if (override) {
                args.shift();
            } 

            access(`./commands/public/${command}.js`, err => {
                if (!err) {
                    let data = require(`./commands/public/${command}.js`);    
                    if (message.member.hasPermission(data.perms) || override) { // verify the user has the correct permissions
                        if (data.args.length == args.length || (typeof data.args == "string" && args.length > 0)) {    // verify the user has entered all the arguments  (or if the argument is a string the allow it)
                            data.call(message, args);
                        } else {
                            if (typeof data.args == "string") {
                                message.channel.send(`Command syntax error, expected syntax: \`${prefix}${command} ${data.args}\``)
                            } else {
                                message.channel.send(`Command syntax error, expected syntax: \`${prefix}${command} ${data.args.join(" ")}\``)
                            }
                        }
                    } else {
                        message.channel.send(`It appears you are missing the permission(s) \`${data.perms.join(" ")}\` to run this command`)
                    }
                    // delete the file cache so the commands can be updated without stopping the bot
                    delete require.cache[require.resolve(`./commands/public/${command}.js`)];
                }
            });

            if (message.author.id == "307429254017056769") {  // only run these commands for bot owneer
                if (message.author.id == "307429254017056769") {  // only run these commands for bot owneer
                    access(`./commands/private/${command}.js`, err => {
                        if (!err) {
                            require(`./commands/private/${command}.js`)(message, args);
                            delete require.cache[require.resolve(`./commands/private/${command}.js`)];
                        }
                    });
                }
            }
        }
    });
}