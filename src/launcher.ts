import Plexi from "./plexi.js";
import auth from "./data/auth.json";
import config from "./data/config.json";

const bot = new Plexi(auth.token, config.owner, config.databasePath);
bot.start();