const { MessageEmbed } = require("discord.js");
const Database = require("../../database.js");
const Config = require("../../data/config.json");

async function getCard(database, setName, pack) {
    return new Promise((resolve, reject) => {
        database.database.get(`SELECT * FROM Card WHERE set_name = ? AND name NOT IN ( ${pack.map(card => `"${card.name}"`).join(", ")} ) ORDER BY RANDOM() LIMIT 1`, setName, (err, row) => {
            if (err) {
                reject(err)
            } else {
                resolve(row);
            }
        });
    });
}

async function getBoosterPack(database, setName) {
    let pack = [];
    while (pack.length < 5) {
        let card = await getCard(database, setName, pack);
        if (card.rarity > Math.floor(Math. random() * 100) + 1) {   // rarity check
            pack.push(card);
        }
    }
    return pack;
}

module.exports = {
    args: ["<pack>"],
    description: "Buy a card pack, to view valid packs and costs run catrd sets",
    call: function(message, args) {
        let database = new Database(Config.database, Config.default_prefix);
        args[0] = args[0].toLowerCase();
        database.database.all(`SELECT * FROM Sets`, (err, rows) => {
            rows = rows.filter(row => row.set_name.toLowerCase() == args[0]);
            if (rows.length > 0) {
                let set = rows[0];
                database.getUser(message.author.id, row => {
                    if (row.coins >= set.cost) {
                        message.channel.send("Generating pack...");

                        // actual code to calculate a booster pack
                        getBoosterPack(database, set.set_name).then(pack => {

                            database.updateUser(message.author.id, "coins", row.coins - set.cost);
                            database.updateUser(message.author.id, "cards", JSON.stringify(JSON.parse(row.cards).concat(pack.map(card => card.name))));

                            let embed = new MessageEmbed()
                                .setColor([114, 137, 218])
                                .setAuthor(`You just bought the ${set.set_name.toLowerCase()} set for ${set.cost} coins!\nYou now have ${row.coins - set.cost} coins`)
                                .addField("Recieved Cards (run catrd info <card> for more details):", pack.map(card => `${card.name} [${card.type}] - ${card.power} power (Ability: ${card.ability_name})`).join("\n"))
                            message.channel.send({embed});

                        });
                    }
                });
            } else {
                message.channel.send("Set not found! Run `catrd sets` to view available options");
            }
        });
        database.disconnect();
    }
}