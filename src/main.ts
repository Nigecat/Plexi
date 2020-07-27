import { promises as fs } from "fs";
import { Command } from "./types.js";
import Database from "./database.js";
import { CommandClient } from "eris";
import auth from "./config/auth.json";
import config from "./config/config.json";
import package_json from "../package.json";

// Wrap our code in an async functinon so we can use await
(async() => {
    const client = new CommandClient(auth.token, {}, { prefix: config.prefix, description: package_json.description, owner: `<@${config.owner}>` })
    const database = new Database(config.databasePath, (id, newPrefix) => client.registerGuildPrefix(id, newPrefix));
    await database.connect();

    (await fs.readdir("./src/commands/")).forEach(async command => {
        // Do nothing if it is not a js file
        if (!command.endsWith(".js")) return;

        // Remove the file extension from the file, this is the name of it and the command used to call it
        const commandName = command.split(".").slice(0, -1).join(" ");

        const data: Command = (await import(`./commands/${command}`)).default;

        // Add our extra arguments to the registerCommand callback
        client.registerCommand(commandName, async (message, args) => {
            await message.channel.sendTyping();
            return await data.call({ message, args, database, client });
        }, data.options);
    });

    client.on("ready", () => {
        console.log(`Logged in as ${client.user.username}#${client.user.discriminator}`);
        client.editStatus("online", { name: "Visual Studio Code", type: 0 });
    });

    // Set all the server prefixes
    (await database.getAllServers()).forEach(server => client.registerGuildPrefix(server.id, server.prefix));

    client.connect();
})();