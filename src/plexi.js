const Discord = require('discord.js');
const client = new Discord.Client();
const commands = require(`${__dirname}/commands.js`);
const PREFIX = '$';

client.on(`ready`, () => {
    client.user.setPresence({ activity: { name: 'you', type: 'WATCHING' }, status: 'online' });
    console.log(`\n\nConnected as ${client.user.tag}, prefix: ${PREFIX}\n`);  
});

client.on('message', message => {
    if (message.author != client.user && message.content.startsWith(PREFIX)) {
        console.log(`Command received: ${message.content} from ${message.author.tag}`);
        
        let command = message.content.split(PREFIX).slice(1).join(PREFIX).toLowerCase().split(' ')[0];    // remove token from string and get first word
        let args = message.content.split(' ').slice(1);

        if (command == "help") {
            let fields = [];
            for (let key in commands) {
                fields.push({        // automatically add commands and their description
                    name: `${PREFIX}${key} ${commands[key].args.join(" ")}`,
                    value: commands[key].description
                });  
            }

            message.channel.send({embed: {
                color: 3447003,
                author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL()
                },
                fields: fields,
                timestamp: new Date(),
                footer: {
                    text: `v${JSON.parse(require('fs').readFileSync(`${__dirname}/package.json`)).version}`
                }
            }});

        } else if (command in commands) {
            if (commands[command].args.length == args.length) {
                commands[command].call(message, args);
            } else {
                message.channel.send(`Command syntax error: \`${PREFIX}${command} ${commands[command].args.join(" ")}\``);
            }
        }
    }
});

client.on('guildCreate', guild => { 
    client.users.fetch('307429254017056769').then(user => user.send(`Joined server: \`${guild.name}\``)) 
});

client.on('guildDelete', guild => { 
    client.users.fetch('307429254017056769').then(user => user.send(`Left server: \`${guild.name}\``)) 
});

client.login(JSON.parse(require('fs').readFileSync(`${__dirname}/auth.json`)).auth);