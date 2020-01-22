const utils = require('./utils.js');
const textCommands = require('./text.js');
const Discord = require('discord.js');

const PREFIX = "$";
const client = new Discord.Client();

client.on('ready', () => {
    client.guilds.forEach((guild) => {
        console.log(`\n - ${guild.name}:\n    -- Members:`);
        guild.members.forEach(member => { console.log(`       --- ${member.displayName}: ${member.user.tag} (${member.user.presence.status})`) });
        console.log(`    -- Channels:`);
        guild.channels.forEach(channel => { if (channel.type == "text") console.log(`       --- ${channel.name}`) }) 
    });

    client.user.setActivity(`your soul (${PREFIX}help)`, {type: "WATCHING"})
    console.log(`\n\nConnected as ${client.user.tag}, prefix: ${PREFIX}\n`);
});

client.on('message', message => {
    if (message.author != client.user && message.content.startsWith(PREFIX)) {
        console.log(`Command received: ${message.content} from ${message.author.tag}`);
        
        let command = message.content.split(PREFIX).slice(1).join(PREFIX).toLowerCase().split(" ")[0];    // remove token from string and get first word
        let args = message.content.split(" ").slice(1);

        // these are the audio commands, text commands are in text.js (apart from help)
        switch (command) {
            case "help": {
                let embed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Plexi')
                    .setThumbnail('https://cdn.discordapp.com/avatars/621179289491996683/b7b990f5028df5de4d9274eb6eed143b.png?size=128')

                    .addField('‎', 'undefined:')
                    .addField(`undefined`, '‎')
                message.channel.send({embed});
                break; 
            }

            case "play":
            case "bruh":
            case "mop":
            case "sec":
            case "naeg": {
                message.channel.send(`\`\`\`javascript\nvar Module=typeof Module!=="undefined"?Module:{};var moduleOverrides={};var key;for(key in Module){if(Module.hasOwnProperty(key)){moduleOverrides[key]=Module[key]}}Module["arguments"]=[];Module["thisProgram"]="./this.program";Module["quit"]=function(status,toThrow){throw toThrow};Module["preRun"]=[];Module["postRun"]=[];var ENVIRONMENT_IS_WEB=false;var ENVIRONMENT_IS_WORKER=false;var ENVIRONMENT_IS_NODE=false;var ENVIRONMENT_HAS_NODE=false;var ENVIRONMENT_IS_SHELL=false;ENVIRONMENT_IS_WEB=typeof window==="object";ENVIRONMENT_IS_WORKER=typeof importScripts==="function";ENVIRONMENT_HAS_NODE=typeof process==="object"&&typeof process.versions==="object"&&typeof process.versions.node==="string";ENVIRONMENT_IS_NODE=ENVIRONMENT_HAS_NODE&&!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_WORKER;ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER;var scriptDirectory="";function locateFile(path){if(Module["locat\`\`\`
                abort(TypeError: Cannot convert "null" to int). Build with -s ASSERTIONS=1 for more info.`);
            }

            default: {
                if (command in textCommands) {
                    textCommands[command](message, args);
                }
            }
        }
    }
});

client.login(JSON.parse(require('fs').readFileSync(`${__dirname}/auth.json`)).token);