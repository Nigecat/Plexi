const commands = require('./commands.js');
const Discord = require('discord.js');
const client = new Discord.Client();
const PREFIX = "$";

client.on('ready', () => {
    client.user.setActivity(`your soul (${PREFIX}help)`, {type: "WATCHING"});
    console.log(`\n\nConnected as ${client.user.tag}, prefix: ${PREFIX}\n`);  
});

client.on('message', message => {
    if (message.author != client.user && message.content.startsWith(PREFIX)) {
        console.log(`Command received: ${message.content} from ${message.author.tag}`);
        
        let command = message.content.split(PREFIX).slice(1).join(PREFIX).toLowerCase().split(" ")[0];    // remove token from string and get first word
        let args = message.content.split(" ").slice(1);

        if (command == "help") {
            let embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Plexi')
                .setThumbnail('https://cdn.discordapp.com/avatars/621179289491996683/b7b990f5028df5de4d9274eb6eed143b.png?size=128')

            for (let key in commands) {
                embed.addField(`${PREFIX}${key} ${commands[key].args.join(" ")}`, '‎')
            }

            message.channel.send({embed});

        } else if (command in commands) {
            if (commands[command].args.length == args.length) {
                commands[command].call(message, args);
            } else {
                message.channel.send(`Command syntax error: \`${PREFIX}${command} ${commands[command].args.join(" ")}\``);
            }
        }
    }
});

client.login(JSON.parse(require('fs').readFileSync(`${__dirname}/auth.json`)).token);