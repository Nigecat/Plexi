const processCommand = require('./commandHelper.js');
const DBL = require('dblapi.js');
const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = class {
    constructor(data) {
        this.token = data.AUTH.token;
        this.topggapikey = data.AUTH.topggapikey;
        this.database = data.DATABASE;
        this.owner = data.CONFIG.owner;
        this.TOTAL_GUILDS = 0;
        this.dbl = new DBL(this.topggapikey, client);        // top.gg api  

        // detect when process has exited (is triggered from commands/private/shutdown.js)
        process.on("exit", this.shutdown.bind(this));
        // gets triggered when control c is pressed
        process.on("SIGINT", this.shutdown.bind(this));
        process.on('uncaughtException', console.log);
    }

    /**
     * Start the bot
     */
    start() {
        client.on("debug", console.log);
        client.on("error", console.log);
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
        let totalUsers = Array.from(client.guilds.cache.values()).reduce((total, guild) => total + guild.members.cache.size, 0);
        let totalChannels = Array.from(client.guilds.cache.values()).reduce((total, guild) => total + guild.channels.cache.size, 0);
        console.log(`Logged in as ${client.user.tag} serving ${totalUsers} users across ${totalChannels} channels in ${client.guilds.cache.size} servers`);
        this.updateStatus();
        this.database.connect(() => {
            this.database.updateAll(client.guilds);
        });
    }

    /**
     * Safely shutdown bot and disconnect from database
     */
    shutdown() {
        console.log("Disconnecting...");
        this.database.disconnect();
        process.exit();
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
        console.log(`Joined server: ${guild.name}`);
        this.database.addServer(guild.id);
        this.updateStatus();
    }

    /**
     * Callback event for when bot leaves a guild
     * @param {object} guild Guild object
     */
    levaeServer(guild) {
        console.log(`Left server: ${guild.name}`);
        this.database.removeServer(guild.id);
        this.updateStatus();
    }

    /**
     * Process a recieved message
     * @param {object} message Message object 
     */
    processMessage(message) {
        if (!message.author.bot) {  // make sure the author of the message isn't a bot
            processCommand(message, this.database, client);
        }
    }
}