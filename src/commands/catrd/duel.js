const { MessageEmbed } = require("discord.js");
const Database = require("../../database.js");
const Config = require("../../data/config.json");

function displayInstructions(message) {
    let commands = [
        "catrd bet <card|coins> - set your bet for the game",
        "catrd play <card> - play a card onto the board (only works if it is your turn)",
        "catrd pass - stop playing cards for this round (only works if it is your turn)",
        "catrd forfeit - give up on the game, you will lose your bet",
        "catrd info <card> - get info on a card",
        "catrd board - view the current board state"
    ];
    let embed = new MessageEmbed()
        .setTitle("A complete guide on how to duel")
        .setColor([255, 0, 0])
        .addField("Intro", "To begin, each user must enter catrd bet <card|coins> to bet something they own, this can either be a card or an amount of coins.\nWhoever wins the duel will take the other person's bet.\n\nAfter both users have set a bet, they must both run catrd bet confirm. Once this happens the game will begin (you have 10 minutes to confirm a bet or the game will expire).")
        .addField("‎", "‎")
        .addField("The Game Itself", "The game consisted of multiple rounds. In each round, each user takes turns playing cards from their hand onto the board (run catrd hand to view your hand, this will be dmed to you)\nOnce you feel like you have played enough cards, you will run catrd pass. Once both players have passed, the total power of each side will be calculated and the person with the highest power wins the round. (if it is a tie, both players gain a point)\nThe first person to win two rounds wins the overall game. If you play all the cards in your hand before someone gets to two wins, you instantly forfeit and the other person wins the game.\nAfter the betting is complete and the game begins, if a user takes more then 3 minutes to do their input they automatically forfeit the game.\nEach card has a type (melee, scout, defense) and will be positioned on the board based on the type (melee at the front, scout in the middle and defense up the back).")
        .addField("‎", "‎") 
        .addField("Commands", commands.join("\n"));
    message.channel.send({embed});
}

async function beginGame(message, database, user1, user2) {
    // shuffle deck and get sub-array of first 7 elements after shuffle to calculate  each user's hand for the match
    user1.hand = user1.deck.sort(() => .5 - Math.random()).slice(0, 7);
    user2.hand = user2.deck.sort(() => .5 - Math.random()).slice(0, 7);

    database.database.run(`INSERT INTO Game ( user1, user2, user1tag, user2tag, user1hand, user2hand, user1Timeout, user2Timeout ) VALUES ( 
        ${user1.id}, ${user2.id}, ?, ?, 
        '${JSON.stringify(user1.hand)}', '${JSON.stringify(user2.hand)}', 
        ${Date.now() + 600000}, ${Date.now() + 600000} )`, user1.tag, user2.tag);

    // DM USER THEIR DRAWN CARDS
    let user1embed = new MessageEmbed()  
        .setColor([255, 0, 0])
        .setTitle(`Your drawn cards:`)
        .addField("‎‎", user1.hand.join("\n"));
    user1.obj.send({embed: user1embed})

    let user2embed = new MessageEmbed()  
        .setColor([255, 0, 0])
        .setTitle(`Your drawn cards:`)
        .addField("‎‎", user2.hand.join("\n"));
    user2.obj.send({embed: user2embed})

    // display gameplay instructions
    displayInstructions(message);
}

module.exports = {
    args: ["<@user>"],
    description: "Duel another user",
    call: function(message, args) {
        if (message.mentions.members.first() != undefined) {
            if (message.mentions.members.first().id != message.author.id) {
                let database = new Database(Config.database, Config.default_prefix);
                let user1 = { obj: message.author, id: message.author.id, tag: message.author.tag, deck: [], hand: [] };
                let user2 = { obj: message.mentions.members.first(), id: message.mentions.members.first().id, tag: message.mentions.members.first().user.tag, deck: [], hand: [] }
                
                // check if matches are supposed to be expired
                database.checkExpire(user1.id);     
                database.checkExpire(user2.id);     
                
                database.addUser(user1.id);
                database.addUser(user2.id);
                database.getUser(user1.id, row => {
                    user1.deck = JSON.parse(row.deck);
                    if (user1.deck.length > 19) {
                        database.getUser(user2.id, row2 => {
                            user2.deck = JSON.parse(row2.deck);
                            if (user2.deck.length > 19) {
                                // make sure neither user is already in a game
                                database.database.get(`SELECT * FROM Game WHERE user1 = ${user1.id} OR user2 = ${user1.id} OR user1 = ${user2.id} OR user2 = ${user2.id} LIMIT 1`, (err, row) => {
                                    if (!err && !row) {
                                        message.channel.send(`Initiating duel between ${message.author} and ${message.mentions.users.first()} ⚔️`);
                                        beginGame(message, database, user1, user2);
                                    } else {
                                        message.channel.send("Either youself or the person you are dueling are already in a game!");
                                    }
                                });
                            } else {
                                message.channel.send(`The person you are trying to duel needs another ${20 - user2.deck.length} cards in their deck before they can duel!`);
                            }
                        });
                    } else {
                        message.channel.send(`You need another ${20 - user1.deck.length} cards in your deck before you can duel!`);
                    }
                });
                database.disconnect();
            } else {
                message.channel.send("You can't duel yourself!");
            }
        } else {
            message.channel.send("Invalid user");
        }
    }
}