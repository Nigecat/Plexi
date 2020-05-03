const Config = require("./data/config.json");
const { readdirSync, access } = require("fs");
const { MessageEmbed } = require("discord.js");

// delete the file cache of a file so the commands can be updated without stopping the bot
function clearCache(file) {
    delete require.cache[require.resolve(file)];
}

module.exports = async function(message, database, client) {
    message.content = message.content.toLowerCase();
    database.getServerInfo(message.guild.id, row => {       // get prefix for server
        const prefix = row.prefix;

        // check if message contains 'peanut' and if so 
        // increase the peanut counter for that user by how many times it appears
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
            message.content = message.content.slice(2);     // remove first two characters of message (g`)
            let emojis = client.emojis.cache.map(x => [x.name, x]);     // get all emojis the bot has access to and convert each one to [emojiName, emojiObject]
            emojis = emojis.filter(emoji => emoji[0].toLowerCase() == message.content.toLowerCase());   // get any emojis that match the specified name
            if (emojis.length > 0) {    // if an emoji was actually found
                embed = new MessageEmbed()                // figure out file format based on the emoji.animated property
                    .setImage(`https://cdn.discordapp.com/emojis/${emojis[0][1].id}${emojis[0][1].animated ? ".gif" : ".png"}`)
                    .setFooter(message.author.tag);
                message.channel.send({embed});
                message.delete();
            }
        }
        
        // generic help command that just lists the commands and some usage info
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
        }

        // help command to get information on a specific command
        else if (message.content.startsWith("$help") || message.content.startsWith(`${prefix}help`)) {
            readdirSync("./commands/public").forEach(file => {
                file = file.split(".")[0];
                if (file == message.content.split(" ")[1]) {
                    let data = require(`./commands/public/${file}`);
                    if (typeof data.args == "string") {
                        data.args = [data.args];
                    }
                    if (data.perms.length > 0) {    // check if any perms are required for the command and change what embed is displayed
                        message.channel.send(`\`\`\`markdown\n# Command\n${prefix}${file.split(".")[0]} ${data.args.join(" ")}\n\n# Description\n${data.description}\n\n# Required Permissions\n${data.perms.join(", ")}\`\`\``);
                    } else {
                        message.channel.send(`\`\`\`markdown\n# Command\n${prefix}${file.split(".")[0]} ${data.args.join(" ")}\n\n# Description\n${data.description}\`\`\``);
                    }
                    // delete the file cache so the commands can be updated without stopping the bot
                    delete require.cache[require.resolve(`./commands/public/${file}`)];
                }
            });
        } 
        
        // general commander handler for executing the correct file
        else if (message.content.startsWith(prefix)) {
            let override = message.content.startsWith(`${prefix}override`) && message.author.id == Config.owner;    // if starts with override and from owner (perm override)
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
                    clearCache(`./commands/public/${command}.js`);
                }
            });

            // restricted commands that can only be run by the bot owner
            if (message.author.id == Config.owner) {  
                access(`./commands/private/${command}.js`, err => {
                    if (!err) {
                        require(`./commands/private/${command}.js`)(message, args);
                        clearCache(`./commands/private/${command}.js`);
                    }
                });
            }
        }
    });
}