const Database = require("../database.js");
const Config = require("../data/config.json");

module.exports.checkPeanut = function (userID, guild, callback) {
    let database = new Database(Config.database, Config.default_prefix);
    database.addUser(userID);
    database.getUser(userID, row => {
        database.disconnect();
        callback(row.peanuts);
        /*
        callback((
            (
                (
                    parseInt(userID.split("")[0]) + 1
                ) * (
                    parseInt(userID.split("")[1]) + 1
                ) * (
                    parseInt(userID.split("")[2]) + 1
                ) * (
                    parseInt(userID.split("")[3]) + 1)
            ) / 10 + (
                parseInt(guild.id.split("")[0]) * userID.split("")
                    .reduce((a, b) => parseInt(a) + parseInt(b), 0)
            )
        ) / 10);
        */
    });
}

module.exports.wordReact = async function(message, text) {
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
    // react to the message with the emojis, this ensures they arrive in the correct order
    text.reduce((promise, emoji) => promise.then(() => message.react(emoji)), Promise.resolve());   
}