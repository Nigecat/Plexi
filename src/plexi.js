const processCommand = require('./commandHelper.js');
const chalk = require("chalk");
const DBL = require('dblapi.js');
const Discord = require('discord.js');
const client = new Discord.Client();

function problem(text) {
    console.log(chalk.redBright(text))
}

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
        client.on("warn", problem);
        client.on("error", problem);
        client.on("debug", console.log);
        client.on("raw", this.onPacket);
        client.on("ready", this.ready.bind(this));
        client.on("messageReactionAdd", this.roleReactAdd.bind(this));
        client.on("messageReactionRemove", this.roleReactRemove.bind(this));
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
        console.log(chalk.greenBright(`Logged in as ${client.user.tag} serving ${client.users.cache.size} users across ${client.channels.cache.size} channels in ${client.guilds.cache.size} servers`));
        this.updateStatus();
        this.database.connect(() => {
            this.database.updateAll(client.guilds);
        });
    }

    /**
     * Safely shutdown bot and disconnect from database
     */
    shutdown() {
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
        console.log(chalk.greenBright(`Joined server: ${guild.name}`));
        this.database.addServer(guild.id);
        this.updateStatus();
    }

    /**
     * Callback event for when bot leaves a guild
     * @param {object} guild Guild object
     */
    levaeServer(guild) {
        console.log(chalk.greenBright(`Left server: ${guild.name}`));
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
                    console.log(chalk.blueBright(`[status] Applying autorole  [${role.name}]  to ${member.user.tag} in ${member.guild.name}`));
                    member.roles.add(role).catch(console.error);
                });
            }
        });
    }

    /**
     * Handler for adding automatic role reacts
     */
    roleReactAdd(reaction, user) {
        if (!user.bot) {
            this.database.getServerInfo(reaction.message.guild.id, row => {
                let data = JSON.parse(row.rolereact);
                if (data.hasOwnProperty(reaction.message.id)) {
                    if (data[reaction.message.id].hasOwnProperty(reaction._emoji.name)) {
                        let member = reaction.message.guild.members.cache.get(user.id);
                        let role = data[reaction.message.id][reaction._emoji.name];
                        member.roles.add(role, "Role reaction").catch(() => { });                 
                    }
                }
            });
        }
    }

    /**
     * Handler for removing automatic role reacts
     */
    roleReactRemove(reaction, user) {
        if (!user.bot) {
            this.database.getServerInfo(reaction.message.guild.id, row => {
                let data = JSON.parse(row.rolereact);
                if (data.hasOwnProperty(reaction.message.id)) {
                    if (data[reaction.message.id].hasOwnProperty(reaction._emoji.name)) {
                        let member = reaction.message.guild.members.cache.get(user.id);
                        let role = data[reaction.message.id][reaction._emoji.name];
                        member.roles.remove(role, "Role reaction").catch(() => { });                 
                    }
                }
            });
        }
    }

    /**
     * Handler to be able to read message reactions from non cached messages (very janky)
     */
    onPacket(packet) {
        // we don't want this to run on unrelated packets
        if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;

        // grab channel to check the message from
        client.channels.fetch(packet.d.channel_id).then(channel => {

            // no need to manually emit the event if it is cached already, as it will get fired automatically
            if (channel.messages.cache.has(packet.d.message_id)) return;

            // fetch the message
            channel.messages.fetch(packet.d.message_id).then(message => {
                
                // emojis can have identifiers of name:id format, so we have to account for that case as well
                const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;

                // this gives us the reaction we need to emit the event properly
                const reaction = message.reactions.cache.get(emoji);

                // adds the currently reacting user to the reaction's users collection.
                if (reaction) reaction.users.cache.set(packet.d.user_id, client.users.cache.get(packet.d.user_id));

                // check which type of event it is before emitting
                if (packet.t === 'MESSAGE_REACTION_ADD') {
                    client.emit('messageReactionAdd', reaction, client.users.cache.get(packet.d.user_id));
                }
                if (packet.t === 'MESSAGE_REACTION_REMOVE') {
                    client.emit('messageReactionRemove', reaction, client.users.cache.get(packet.d.user_id));
                }
            });
        });
    }
}