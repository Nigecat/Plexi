const respond = require('./responder').respond;
const Discord = require('discord.js');
const client = new Discord.Client();
const TOKEN = "NjM4MjgwMjM5NjI1MjczMzY0.XfL9gQ.RAuzSQX53nU_kK3dy5UtBzOkqSE";
const WHITELIST = [
    "638659193913737226",     //Crack Shack: bot-conversation
//    "",                       //Stroke the Artichoke: 
    "654879931150630912"      //Plexi: chatbot
]

client.on('ready', () => {
    client.user.setActivity("your soul", {type: "WATCHING"});
    console.log(`\n\nConnected as ${client.user.tag}\n`);
});

client.on('message', async message => {
    if (message.author != client.user && WHITELIST.includes(message.channel.id.toString())) {
        console.log(`Message received: ${message.content}`);
        let response = respond(message.content);
        console.log(`Sending response: ${response}\n`);
        message.channel.send(response)
    }
});

client.login(TOKEN);