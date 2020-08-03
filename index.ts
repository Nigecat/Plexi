import { config } from "dotenv";
import { Plexi } from "./src/plexi";

config();
const client = new Plexi();

client.login(process.env.DISCORD_TOKEN);
