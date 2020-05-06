const { Client } = require("discord.js");
const Database = require("../../database.js");
const Config = require("../../data/config.json");

const valid_sorts = ["coins", "peanuts"];

async function getLeaderboard(message, rows, args) {
    const client = new Client();
    client.on("ready", async () => {
        let data = [];
        for (let i = 0; i < rows.length; i++) {
            let user = await client.users.fetch(rows[i].id);
            data.push(`[${i + 1}]${" ".repeat(7 - (i + 1).toString().length)}> ${user.username}`);   // auto calculate the number of spaces required
            data.push(`                    Total ${args[0]}: ${rows[i][args[0]]}`);
        }; 
        data = data.join("\n");
        message.channel.send(`\`\`\`markdown\n# Top #10 global for ${args[0]}\n\n${data}\`\`\``);
        message.channel.stopTyping();
        client.destroy();
    });
    client.login(require("../../data/auth.json").token)
}

module.exports = {
    args: [`<${valid_sorts.join("|")}>`],
    perms: [],
    description: "View the global top leaderboard on a variable",
    call: async function(message, args) {
        args[0] = args[0].toLowerCase();
        if (valid_sorts.includes(args[0])) {
            message.channel.startTyping();
            let database = new Database(Config.database, Config.default_prefix);
            database.database.all(`SELECT * FROM User WHERE id != ${Config.owner} ORDER BY ${args[0]} DESC LIMIT 10`, (err, rows) => {    
                getLeaderboard(message, rows, args);
            });
            database.disconnect();
        }
    }
}