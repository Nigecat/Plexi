const moment = require('moment');
const cliProgress = require('cli-progress'); 
const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const Discord = require('discord.js');
const client = new Discord.Client();
const maxMessageFetch = 50;
const PREFIX = "a%";

function formatTime(timestamp) {
    //console.log(`Conveting timestamp ${timestamp} to human readable format...`);
    return moment(timestamp).format("DD/MM/YYYY - hh:mm:ss a").replace("pm", "PM").replace("am", "AM"); 
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

function getFirstMessage(channel) {
    return new Promise(async resolve => {
        console.log("Locating first message in target channel...");
        let messages = await channel.messages.fetch({ limit: maxMessageFetch });    // get most recent messages
        while (messages.size == maxMessageFetch) {      // check if got max number of messages
            console.log(`Performing message jump (${formatTime(messages.last().createdAt)})`);
            messages = await channel.messages.fetch({ limit: maxMessageFetch, before: messages.last().id });    // if not move search backwards in time to the earliest pulled messages
        }
        console.log(`First message located!  (${formatTime(messages.last().createdAt)})`);
        // return once less then the max messages have been found, this means that the search is at the start of the channel
        resolve(messages.last());
    });
}

function getMessages(targetChannel) {
    return new Promise(async resolve => {
        let messages = [];
        let position = await getFirstMessage(targetChannel).id;
    
        while (messages.length % maxMessageFetch == 0) {  // run until not multiple of max message fetch, this will stop only after all messages from a channel have been pulled
            let data = await targetChannel.messages.fetch({ limit: maxMessageFetch, before: position });  // get first chunk of messages after first message
            position = data.last().id;  // set position to latest message
            data = Array.from(data.values());
            data.forEach(message => {
                if (message.type != "GUILD_MEMBER_JOIN") {
                    // add message data to array
                    if (message.embeds.length > 0) {
                        messages.push({ timestamp: message.createdTimestamp, author: message.author, content: message.content, embed: message.embeds[0] });
                    } else if (message.attachments.size > 0) {
                        messages.push({ timestamp: message.createdTimestamp, author: message.author, content: message.content, attachments: Array.from(message.attachments.values()).map(attachment => attachment.attachment) });
                    } else if (message.reactions.cache.size > 0) {
                        messages.push({ timestamp: message.createdTimestamp, author: message.author, content: message.content, reactions: message.reactions.cache });
                    } else {
                        messages.push({ timestamp: message.createdTimestamp, author: message.author, content: message.content });
                    }
                } else {
                    messages.push({ timestamp: message.createdTimestamp, author: `${message.author} joined the server!`, content: "" });
                }
            });
        }
    
        messages.reverse();   // put in chronological order
        resolve(messages);
    });
}

async function sendData(messages, destinationChannel) {
    console.log(`Sending ${messages.length} messages from target channel to destination channel. ETA: ${(messages.length * 750) / 60000} minutes`);
    progress.start(messages.length, 0);
   
    for (let i = 0; i < messages.length; i++) {
        let message = messages[i];
        if (message.content == "") {
            var data = `${formatTime(message.timestamp)} ${message.author}`;
        } else {
            var data = `${formatTime(message.timestamp)} ${message.author} ${message.content}`;
        }

        if (message.embed) {
            await destinationChannel.send(data, { embed: message.embed } ).catch(() => {});
        }
        else if (message.attachments) {
            try {
                await destinationChannel.send(data, { files: message.attachments } ).catch(() => {});
            } catch (err) {
                await destinationChannel.send(data).catch(() => {});
            }
        } else if (message.reactions) {
            let temp = await destinationChannel.send(data).catch(() => {});
            await message.reactions.each(async emoji => await temp.react(emoji._emoji).catch(() => {}));
        } else {
            await destinationChannel.send(data).catch(() => {});
        }
        progress.update(i + 1);
        await sleep(750);
    }
    progress.stop();
    console.log("Finished!");
}

async function serverInfo(message, targetServer) {
    let embed = new Discord.MessageEmbed()
        .setTitle(targetServer.name)
        .setThumbnail(targetServer.iconURL())
        .addField("ID:", targetServer.id)
        .addField("Created at:", targetServer.createdAt)
        .addField("Owner:", `${targetServer.owner} (${targetServer.ownerID})`);
    message.channel.send({embed});
}

client.on("ready", () => { 
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setPresence({ status: "dnd" });
});

client.on("message", async message => {
    if (!message.author.bot && message.content.startsWith(PREFIX)) {

        let args = message.content.split(PREFIX)[1].split(" ");

        if (message.content.startsWith(`${PREFIX}info`)) {
            let targetServer = Array.from(client.guilds.cache.values()).filter(guild => guild.id == args[1]);
            
            if (targetServer.length > 0) {
                targetServer = targetServer[0];
                serverInfo(message, targetServer);
                
            } else {
                message.channel.send("Invalid target server, make sure this bot is in the server you are trying to target!");
            }

        } else if (args.length == 4) {
            let targetServer = Array.from(client.guilds.cache.values()).filter(guild => guild.id == args[0]);
            let destinationServer = Array.from(client.guilds.cache.values()).filter(guild => guild.id == args[1]);

            if (targetServer.length > 0) {
                targetServer = targetServer[0];

                if (destinationServer.length > 0) {
                    destinationServer = destinationServer[0];
                    targetChannel = Array.from(targetServer.channels.cache.values()).filter(channel => channel.id == args[2]);
                    
                    if (targetChannel.length > 0) {
                        targetChannel = targetChannel[0];
                        destinationChannel = Array.from(destinationServer.channels.cache.values()).filter(channel => channel.id == args[3]);

                        if (destinationChannel.length > 0) {
                            destinationChannel = destinationChannel[0];

                            let messages = await getMessages(targetChannel);
                            sendData(messages, destinationChannel);

                        } else {
                            message.channal.send("Invalid destination channel, make sure this bot is in the server you are trying to target!");
                        }
                    } else {
                        message.channal.send("Invalid target channel, make sure this bot is in the server you are trying to target!");
                    }
                } else {
                    message.channal.send("Invalid destination server, make sure this bot is in the server you are trying to target!");
                }
            } else {
                message.channal.send("Invalid target server, make sure this bot is in the server you are trying to target!");
            }
        } else {
            message.channel.send(`Invalid number of args, run \`${PREFIX}help\` for more details`);
        }
    }
});

client.login("NjIxMTc5Mjg5NDkxOTk2Njgz.XqYI1A.jlBux-KtGhuOqH72CJJ2omK_-oo");