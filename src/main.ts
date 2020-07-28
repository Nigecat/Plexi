import { open } from "sqlite";
import { existsSync } from "fs";
import { Database } from "sqlite3";
import * as config from "./config/config.json";
import * as clientConfig from "./config/clientConfig.json";
import { resolve as pathResolve, join as pathJoin } from "path";
import { CommandoClient, SQLiteProvider } from "discord.js-commando";

// If the auth file has not been created
if (!existsSync("src/config/auth.json")) {
    console.error("No auth file found! Create a json file at `src/config/auth.json` and ensure it has a token field with the bot token in it.");
    process.exit(1);
}

(async() => {
    // Now we know the auth file has to exist so we can safetly import it
    const { token } = await import("./config/auth.json");

    const client = new CommandoClient(clientConfig);

    // Set the client settings provider to a sqlite database, this is only used for storing prefixes by commando
    client.setProvider(new SQLiteProvider(await open({ filename: config.settingsProvider, driver: Database })));

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
            ["misc", "Miscellaneous"],
            ["image", "Image Manipulation"]
        ])
        .registerDefaultGroups()
        .registerDefaultCommands({ unknownCommand: false })
        .registerCommandsIn(pathJoin(pathJoin(pathResolve(), "src"), "commands"));
    
    client.login(token);
})();