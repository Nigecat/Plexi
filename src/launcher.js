const Database = require("./database.js");
const Bot = require("./plexi.js");
const Config = require("./data/config.json");

const Plexi = new Bot({
    TOKEN: require("./data/auth.json").token,
    DATABASE: new Database(Config.database, Config.default_prefix)
});

Plexi.start();