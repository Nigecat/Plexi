import config from "./config/config.json";
import { config as loadEnv } from "dotenv";
import { PlexiClient, PlexiOptions } from "plexi/client";

const client = new PlexiClient(config as PlexiOptions);

loadEnv();

client.on("debug", console.log);

client.login(process.env.TOKEN);