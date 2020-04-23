const { appendFileSync } = require('fs');
const commands = require('./commands.js');
const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = class {
    constructor(config) {
        this.PREFIX = config.PREFIX;
        this.TOKEN = config.TOKEN;
        this.OWNER = config.OWNER;
        this.TOTAL_GUILDS = 0;
    }

    /**
     * Write a log out to log.txt
     * @param {string} details The log details
     */
    log(details) {
        // write log and remove all newlines
        appendFileSync("log.txt", "\n" + `[${new Date().toLocaleString()}]: ${details}`.replace(/[\n\r]/g, ""));    
    }

    /**
     * Start the bot
     */
    start() {
        client.on("ready", this.setStatus.bind(this));
        client.on("message", this.processMessage.bind(this));
        client.on("guildCreate", this.joinGuild.bind(this));
        client.on("guildDelete", this.leaveGuild.bind(this));
        client.login(this.TOKEN);
    }

    /**
     * Set the bot's status
     */
    setStatus() {
        this.TOTAL_GUILDS = client.guilds.cache.size;
        client.user.setPresence({ activity: { type: "LISTENING", "name": `music (${this.TOTAL_GUILDS} guilds)` }, status: "online" });
    }

    /**
     * Callback event for when bot joins a guild
     * @param {object} guild Guild object
     */
    joinGuild(guild) {
        client.users.fetch(this.OWNER.id).then(user => user.send(`Joined guild: \`${guild.name}\``));
        this.TOTAL_GUILDS += 1;
        this.setStatus();
        this.log(`Guild joined, total guilds now at ${this.TOTAL_GUILDS}`);
    }

    /**
     * Callback event for when bot leaves a guild
     * @param {object} guild Guild object
     */
    leaveGuild(guild) {
        client.users.fetch(this.OWNER.id).then(user => user.send(`Left guild: \`${guild.name}\``));
        this.TOTAL_GUILDS -= 1;
        this.setStatus();
        this.log(`Guild left, total guilds now at ${this.TOTAL_GUILDS}`);
    }

    /**
     * Process a recieved message
     * @param {object} message Message object 
     */
    processMessage(message) {
        if (message.author != client.user && message.content.startsWith(this.PREFIX)) {
            this.log(`Command received: ${message.content} from ${message.author.tag}`);
            let command = message.content.split(this.PREFIX).slice(1).join(this.PREFIX).toLowerCase().split(' ')[0];    // remove token from string and get first word
            let args = message.content.split(' ').slice(1);

            if (command == "help") {
                let fields = [];
                for (let key in commands) {
                    fields.push({        // automatically add commands and their description
                        name: `${this.PREFIX}${key} ${commands[key].args.join(" ")}`,
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
                        text: `v${JSON.parse(require('fs').readFileSync('./package.json')).version}`
                    }
                }});

            } else if (command in commands) {
                if (commands[command].args.length == args.length) {
                    commands[command].call(message, args);
                } else {
                    message.channel.send(`Command syntax error: \`${this.PREFIX}${command} ${commands[command].args.join(" ")}\``);
                }
            }

        }
    }
}