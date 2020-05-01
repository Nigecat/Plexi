const { MessageEmbed } = require("discord.js");
const Database = require("../../database.js");
const Config = require("../../data/config.json");

function capitalizeFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
}

async function getType(database, card) {
    return new Promise((resolve, reject) => {
        database.database.get(`SELECT type FROM Card WHERE name = ?`, card, (err, row) => {
            resolve(row.type);
        });
    });
}

async function generateBoardEmbed(database, user1, user2) {
    user1[1] = user1[1].map(w => capitalizeFirstLetter(w));
    user2[1] = user2[1].map(w => capitalizeFirstLetter(w));
    user1.push({ melee: [], scout: [], defense: [] });
    user2.push({ melee: [], scout: [], defense: [] });

    for (const card of user1[1]) {
        let type = await getType(database, card);
        user1[2][type].push(card);
    }

    for (const card of user2[1]) {
        let type = await getType(database, card);
        user2[2][type].push(card);
    }

    let embed = new MessageEmbed()
        .setColor([255, 0, 0])
        .setTitle(`${user1[0]} | ${user2[0]}`)
        .addField("Melee", user1[2].melee.join(", ") != "" ? user1[2].melee.join("\n") : "‎", true)
        .addField("Melee", user2[2].melee.join(", ") != "" ? user2[2].melee.join("\n") : "‎", true)
        .addField("‎", "‎")
        .addField("Scout", user1[2].scout.join(", ") != "" ? user1[2].scout.join("\n") : "‎", true)
        .addField("Scout", user2[2].scout.join(", ") != "" ? user2[2].scout.join("\n") : "‎", true)
        .addField("‎", "‎")
        .addField("Defense", user1[2].defense.join(", ") != "" ? user1[2].defense.join("\n") : "‎", true)
        .addField("Defense", user2[2].defense.join(", ") != "" ? user2[2].defense.join("\n") : "‎", true);

    return embed;
}

module.exports = {
    args: [],
    description: "Display the current board for the game you are in",
    call: async function(message) {
        let database = new Database(Config.database, Config.default_prefix);
        database.checkExpire(message.author.id);     
        database.inMatch(message.author.id).then(async match => {
            if (match) {
                database.getGame(message.author.id, async row => {
                    let user1 = [row.user1tag, JSON.parse(row.user1active)];
                    let user2 = [row.user2tag, JSON.parse(row.user2active)];
                    let embed = await generateBoardEmbed(database, user1, user2);
                    message.channel.send({embed});
                });
            } else {
                message.channel.send("You must be in a duel to run this!");     
            }
        });
        database.disconnect();
    }
}