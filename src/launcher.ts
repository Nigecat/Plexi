import Plexi from "./plexi.js";
import auth from "./config/auth.json";

const bot = new Plexi(auth.token);
bot.start();