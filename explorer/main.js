const { Client } = require("discord.js");
const commands = require("./commands.js");
const client = new Client();
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});

function input(prompt) {
    return new Promise(resolve => readline.question(prompt, resolve));
}

client.on("ready", async () => {
    const user = `${client.user.id}@${client.user.tag}`;
    let pos = "~";   // Follows the format of   ~/<serverID>/<channelID>

    while (true) {
        const res = await input(`\n\u001b[32m${user} ${pos}\x1b[0m\n$ `);
        const command = res.split(" ")[0];
        const args = res.split(" ").slice(1).join(" ");

        if (command in commands) {
            pos = await commands[command](client, pos, args);
        } else {
            console.log(`${command}: command not found`);
        }
    }
});

client.login(require("../src/data/auth.json").token);