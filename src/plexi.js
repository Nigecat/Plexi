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
        this.dbl = new DBL(this.topggapikey, client);        // top.gg api  

        // detect when process has exited (is triggered from commands/private/shutdown.js)
        process.on("exit", this.shutdown.bind(this));
        // gets triggered when control c is pressed
        process.on("SIGINT", this.shutdown.bind(this));
        process.on("uncaughtException", console.log);
    }

    /**
     * Start the bot
     */
    start() {
        client.on("warn", console.log);
        client.on("error", console.log);
        client.on("debug", console.log);
        client.on("ready", this.ready.bind(this));
        client.on("message", this.processMessage.bind(this));
        client.on("guildMemberAdd", this.autoRole.bind(this));
        client.on("guildCreate", this.joinServer.bind(this));
        client.on("guildDelete", this.levaeServer.bind(this));
        client.login(this.token);
    }

    /**
     * Callback function for when bot starts
     */
    ready() {
        console.log(`Logged in as ${client.user.tag} serving ${client.users.cache.size} users across ${client.channels.cache.size} channels in ${client.guilds.cache.size} servers`);
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
        client.user.setPresence({ activity: { type: "PLAYING", "name": `$help | ${client.guilds.cache.size} servers` }, status: "online" });
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
        if (!message.author.bot && message.guild) {  // make sure the author of the message isn't a bot and it isn't from a dm channel
            processCommand(message, this.database, client);
        }
    }

    /**
     * Gets called when a new member joins a server, checks for autoroles 
     */
    autoRole(member) {
        this.database.getServerInfo(member.guild.id, guild => {
            if (guild.autorole != null) {
                member.guild.roles.fetch(guild.autorole).then(role => {
                    console.log(`Applying autorole  [${role.name}]  to ${member.user.tag} in ${member.guild.name}`);
                    member.roles.add(role).catch(console.error);
                });
            }
        });
    }
}