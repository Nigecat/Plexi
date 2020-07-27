import auth from "./config/auth.json";
import config from "./config/config.json";
import commando from "discord.js-commando";
const { CommandoClient } = commando;

const client = new CommandoClient(config);

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setPresence({ status: "online", activity: { type: "PLAYING", name: "Visual Studio Code" } });
});

client.login(auth.token);