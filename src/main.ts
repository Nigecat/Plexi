import path from "path";
import auth from "./config/auth.json";
import config from "./config/config.json";
import Commando from "discord.js-commando";

const client = new Commando.CommandoClient(config);

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
    .registerCommandsIn(path.join(path.join(path.resolve(), "src"), "commands"));

client.login(auth.token);