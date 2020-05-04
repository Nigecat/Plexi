const Database = require("./database.js");
const Bot = require("./plexi.js");
const Config = require("./data/config.json");
let Auth = require("./data/auth.json");

const Plexi = new Bot({
    AUTH: Auth, 
    CONFIG: Config, 
    DATABASE: new Database(Config.database, Config.default_prefix)
});

Plexi.start();