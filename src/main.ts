import { token } from "./config/auth.json";
import * as config from "./config/config.json";
import { CommandoClient } from "discord.js-commando";
import { resolve as pathResolve, join as pathJoin } from "path";

const client = new CommandoClient(config);

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setPresence({ status: "online", activity: { type: "PLAYING", name: "Visual Studio Code" } });
});

client.on("debug", console.log);
client.on("error", console.error);

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ["misc", "Miscellaneous Commands"]
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(pathJoin(pathJoin(pathResolve(), "src"), "commands"));

client.login(token);