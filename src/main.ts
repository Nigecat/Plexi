import { open } from "sqlite";
import { Database } from "sqlite3";
import { config as loadEnv } from "dotenv";
import * as config from "./config/config.json";
import * as clientConfig from "./config/clientConfig.json";
import { resolve as pathResolve, join as pathJoin } from "path";
import { CommandoClient, SQLiteProvider } from "discord.js-commando";

(async() => {
    loadEnv();

    const client = new CommandoClient(clientConfig);

    // Set the client settings provider to a sqlite database, this is only used for storing prefixes by commando
    client.setProvider(new SQLiteProvider(await open({ filename: config.settingsProvider, driver: Database })));

    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}`);
        client.user.setPresence({ status: "online", activity: { type: "PLAYING", name: clientConfig.commandPrefix + "help" } });
    });
    
    client.on("debug", console.log);
    client.on("error", console.error);
    
    client.registry
        .registerDefaultTypes()
        .registerGroups([
            ["misc", "Miscellaneous"],
            ["image", "Image Manipulation"],
            ["music", "Music"]
        ])
        .registerDefaultGroups()
        .registerDefaultCommands({ unknownCommand: false })
        .registerCommandsIn(pathJoin(pathJoin(pathResolve(), "src"), "commands"));
    
    client.login(process.env.TOKEN);
})();