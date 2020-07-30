import { config as loadEnv } from "dotenv";
import * as config from "./config/config.json";
import { PlexiClient, PlexiOptions } from "plexi/client";

const client = new PlexiClient(config as PlexiOptions);

loadEnv();

client.registerCommands("src/commands");
client.on("debug", console.log);

client.login(process.env.TOKEN);