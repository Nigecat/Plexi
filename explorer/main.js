const { Client } = require("discord.js");
const { createInterface } = require("readline");
const { token } = require("../src/config/auth.json");
const commands = require("./commands.js");
const client = new Client();
const readline = createInterface({
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
        const data = res.split("&&").map(cmd => cmd.trim());

        for (let i = 0; i < data.length; i++) {
            const command = data[i].split(" ")[0];
            const args = data[i].split(" ").slice(1).join(" ");
            
            if (command in commands) {
                try {
                    pos = await commands[command](client, pos, args);
                } catch (err) {
                    console.log("\x1b[31m%s: %s\x1b[0m", err.name, err.message);
                }
            } else {
                console.log(`${command}: command not found`);
            }
        };
    }
});

client.login(token);