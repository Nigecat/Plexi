import { open } from "sqlite";
import { Database } from "sqlite3";
import { token } from "./config/auth.json";
import * as config from "./config/config.json";
import * as clientConfig from "./config/clientConfig.json";
import { resolve as pathResolve, join as pathJoin } from "path";
import { CommandoClient, SQLiteProvider } from "discord.js-commando";

(async() => {
    const client = new CommandoClient(clientConfig);

    const db = await open({ filename: config.databasePath, driver: Database });
    client.setProvider(new SQLiteProvider(db));

    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}`);
        client.user.setPresence({ status: "online", activity: { type: "PLAYING", name: clientConfig.commandPrefix + "help" } });
    });
    
    client.on("debug", console.log);
    client.on("error", console.error);
    process.on("unhandledRejection", console.error);
    
    client.registry
        .registerDefaultTypes()
        .registerGroups([
            ["misc", "Miscellaneous"]
        ])
        .registerDefaultGroups()
        .registerDefaultCommands()
        .registerCommandsIn(pathJoin(pathJoin(pathResolve(), "src"), "commands"));
    
    client.login(token);
})();