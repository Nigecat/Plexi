const Database = require("./database.js");
const Bot = require("./plexi.js");
const Config = require("./data/config.json");

const Plexi = new Bot({
    TOKEN: require("./data/auth.json").token,
    TOPGGAPIKEY: require("./data/auth.json").topggapikey,
    DATABASE: new Database(Config.database, Config.default_prefix)
});

Plexi.start();