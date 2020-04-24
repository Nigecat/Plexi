const Database = require("./database.js");
const Bot = require("./plexi.js");

const Plexi = new Bot({
    DEFAULT_PREFIX: "$", 
    TOKEN: require("./configuration/auth.json").token,
    DATABASE: new Database("./configuration/config.sqlite")
});

Plexi.start();