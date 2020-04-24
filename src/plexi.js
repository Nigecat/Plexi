const processCommand = require('./commandHelper.js');
const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = class {
    constructor(config) {
        this.default_prefix = config.DEFAULT_PREFIX;
        this.token = config.TOKEN;
        this.database = config.DATABASE;
        this.TOTAL_GUILDS = 0;
    }

    /**
     * Start the bot
     */
    start() {
        client.on("debug", console.log);
        client.on("ready", this.ready.bind(this));
        client.on("message", this.processMessage.bind(this));
        client.on("guildCreate", this.joinServer.bind(this));
        client.on("guildDelete", this.levaeServer.bind(this));
        client.login(this.token);
    }

    /**
     * Callback function for when bot starts
     */
    ready() {
        this.database.updateAll(client.guilds);
        this.updateStatus();
        this.database.connect(this.default_prefix);
    }

    /**
     * Set the bot's status
     */
    updateStatus() {
        this.TOTAL_GUILDS = client.guilds.cache.size;
        client.user.setPresence({ activity: { type: "PLAYING", "name": `$help | ${this.TOTAL_GUILDS} servers` }, status: "online" });
    }

    /**
     * Callback event for when bot joins a guild
     * @param {object} guild Guild object
     */
    joinServer(guild) {
        this.database.addServer(guild.id);
        this.updateStatus();
    }

    /**
     * Callback event for when bot leaves a guild
     * @param {object} guild Guild object
     */
    levaeServer(guild) {
        this.database.removeServer(guild.id);
        this.updateStatus();
    }

    /**
     * Process a recieved message
     * @param {object} message Message object 
     */
    processMessage(message) {
        if (message.author != client.user) {
            processCommand(message, this.database);
        }
    }
}