import { open } from "sqlite";
import { Database } from "sqlite3";
import { token } from "./config/auth.json";
import * as config from "./config/config.json";
import { resolve as pathResolve, join as pathJoin } from "path";
import { CommandoClient, SQLiteProvider } from "discord.js-commando";

(async() => {
    const client = new CommandoClient(config);

    const db = await open({ filename: pathJoin(pathJoin(pathJoin(pathResolve(), "src"), "data"), "data.sqlite"), driver: Database });
    client.setProvider(new SQLiteProvider(db));

    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}`);
        client.user.setPresence({ status: "online", activity: { type: "PLAYING", name: config.commandPrefix + "help" } });
    });
    
    client.on("debug", console.log);
    client.on("error", console.error);
    process.on("unhandledRejection", console.error);
    
    client.registry
        .registerDefaultTypes()
        .registerGroups([
            ["misc", "Miscellaneous Commands"]
        ])
        .registerDefaultGroups()
        .registerDefaultCommands()
        .registerCommandsIn(pathJoin(pathJoin(pathResolve(), "src"), "commands"));
    
    client.login(token);
})();