// kontatsu

const Bot = require('./plexi.js');
const Plexi = new Bot({
    PREFIX: "$", 
    TOKEN: JSON.parse(require("fs").readFileSync("./auth.json")).auth,
    OWNER: { 
        "tag": "Nigecat#2288",
        "id": "307429254017056769"
    }
});

Plexi.start();