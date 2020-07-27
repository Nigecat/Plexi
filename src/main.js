const Eris = require("eris");
const Database = require("./database.js");
const { readdir } = require("fs").promises;
const { token } = require("./config/auth.json");
const { version, description } = require("../package.json");
const { prefix, owner, databasePath } = require("./config/config.json");

async function main() {
    const client = new Eris.CommandClient(token, {}, { prefix, description, owner: `<@${owner}>` });

    // Update the guild prefix's when they change
    const database = new Database(databasePath, (id, prefix) => client.registerGuildPrefix(id, prefix));
    await database.connect();

    (await readdir("./src/commands/")).forEach(command => {
        const data = require(`./commands/${command}`);
        // Remove the file extension from the file, this is the name of it and the command used to call it
        const commandName = command.split(".").slice(0, -1).join(" ");
        // Add our extra arguments 
        client.registerCommand(commandName, async (message, args) => {
            await message.channel.sendTyping();
            return await data.call({ message, args, database, client });
        }, data.options);
    });

    
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.username}#${client.user.discriminator}`);
        client.editStatus("online", { name: "Visual Studio Code" });
    });

    // Set all of our server prefixes
    (await database.getAllServers()).forEach(server => client.registerGuildPrefix(server.id, server.prefix));
    
    client.connect();
}

main();

