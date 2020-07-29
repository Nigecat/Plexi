import * as Keyv from "keyv";
import { open } from "sqlite";
import { Database } from "sqlite3";
import { PlexiClient } from "./client.js";
import { config as loadEnv } from "dotenv";
import * as config from "./config/config.json";
import { SQLiteProvider } from "discord.js-commando";
import * as clientConfig from "./config/clientConfig.json";
import { resolve as pathResolve, join as pathJoin } from "path";

(async() => {
    loadEnv();

    const client = new PlexiClient(clientConfig);
    client.data.autoroles = new Keyv(`sqlite://${config.database}`, { namespace: "autoroles" });

    // Set the client settings provider to a sqlite database, this is only used for storing prefixes by commando
    client.setProvider(new SQLiteProvider(await open({ filename: config.settingsProvider, driver: Database })));

    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}`);
        client.user.setPresence({ status: "online", activity: { type: "PLAYING", name: clientConfig.commandPrefix + "help" } });
    });
    
    // If all users have left a voice channel the bot is in then we leave as well
    client.on("voiceStateUpdate", (oldState, newState) => {
        // Check if we are the only user in the voice channel
        if (oldState.channel && oldState.channel.members.size === 1 && oldState.channel.members.first().id === client.user.id) {
            oldState.channel.guild.me.voice.channel.leave();
        }
    });

    // On member join event for autorole handler
    client.on("guildMemberAdd", async member => {
        const role = await client.data.autoroles.get(member.guild.id);
        // If this server has an autorole set
        if (role) {
            member.roles.add(role);
        }
    });

    client.on("debug", console.log);
    client.on("error", console.error);
    
    client.registry
        .registerDefaultTypes()
        .registerGroups([
            ["misc", "Miscellaneous"],
            ["image", "Image Manipulation"],
            ["music", "Music"],
            ["admin", "Administrative"]
        ])
        .registerDefaultGroups()
        .registerDefaultCommands({ unknownCommand: false })
        .registerCommandsIn(pathJoin(pathJoin(pathResolve(), "src"), "commands"));
    
    client.login(process.env.TOKEN);
})();