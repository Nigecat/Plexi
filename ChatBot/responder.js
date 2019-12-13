const fs = require("fs");
const data = new Array();
fs.readFileSync(`${__dirname}/data.txt`, "utf-8").split("\n").forEach((line) => {
    data.push(cleanString(line));
});
const fallback = [
    "fuck",
    "shit",
    "fuuuuuuuuuuuuk",
    "ur gay",
    "im not gay"
];

module.exports = {
    /**
     * @param {string} text input text to respond to
     */
    respond: function(text) {
        text = cleanString(text);
        if (data.includes(text)) {
            for (let i = 0; i < data.length; i++) {
                if (data[i] == text && !data[i + 1].includes("@")) {
                    return data[i + 1];
                }
            }
        } else {
            return fallback[Math.floor(Math.random() * fallback.length)];
        }
    }
}

function cleanString(str) {
    return str.toLowerCase().replace(/[.,\/#!$?%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ").trim();
}