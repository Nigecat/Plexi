import { PlexiClient } from "./client";
import { config as loadEnv } from "dotenv";

const client = new PlexiClient({
    allowedMentions: { roles: [], users: [] },
    disableMentions: "everyone",
    presence: { status: "online", activity: { name: "$help" } }
});

loadEnv();

client.on("debug", console.log);

client.login(process.env.TOKEN);