const Database = require("../database.js");
const Config = require("../data/config.json");

module.exports.checkPeanut = function(userID, guild, callback) {
    let database = new Database(Config.database, Config.default_prefix);
    database.addUser(userID);
    database.getUser(userID, row => {
        database.disconnect();
        callback(row.peanuts);
    });
}

// check if a game has expired and if so auto clear the rows (specified users)
module.exports.checkExpire = async function(database, user1ID, user2ID) {
    return new Promise((resolve, reject) => {
        database.database.all(`SELECT * FROM Game WHERE user1 = ${user1ID} OR user2 = ${user1ID} OR user1 = ${user2ID} OR user2 = ${user2ID} LIMIT 1`, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                if (rows.length != 0) {
                    let time = Date.now();
                    rows.forEach(row => {
                        if (row.user1timeout - time < 0 || row.user2timeout - time < 0) {
                            database.database.run(`DELETE FROM Game WHERE user1 = ${row.user1} AND user2 = ${row.user2}`);
                        }
                    })
                }
            }
        }); 
    });
}

module.exports.toEmoji = function(text) {
    text = text.toLowerCase().replace(/[^A-Za-z]/g, "").split("");
    let emojis = {
        a: "🇦", b: "🇧", c: "🇨", d: "🇩", e: "🇪",
        f: "🇫", g: "🇬", h: "🇭", i: "🇮", j: "🇯",
        k: "🇰", l: "🇱", m: "🇲", n: "🇳", o: "🇴",
        p: "🇵", q: "🇶", r: "🇷", s: "🇸", t: "🇹",
        u: "🇺", v: "🇻", w: "🇼", x: "🇽", y: "🇾",
        z: "🇿"
    }
    text.forEach((char, index) => {
        text[index] = emojis[char];
    });
    return text;
}

module.exports.wordReact = async function(message, text) {
    text = text.toLowerCase().replace(/[^A-Za-z]/g, "").split("");
    text = module.exports.toEmoji(text);
    // react to the message with the emojis, this ensures they arrive in the correct order
    text.reduce((promise, emoji) => promise.then(() => message.react(emoji)), Promise.resolve());   
}