import Plexi from "./plexi.js";
import auth from "./data/auth.json";
import config from "./data/config.json";

const bot: Plexi = new Plexi(auth.token, auth.topggapikey, config.owner, config.databasePath);
bot.start();