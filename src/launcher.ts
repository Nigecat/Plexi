import Plexi from "./plexi.js";
import auth from "./config/auth.json";
import config from "./config/config.json";

const bot = new Plexi(auth.token, config.database, config.owner);
bot.start();