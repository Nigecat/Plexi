"use strict";

const Eris = require("eris");
const Database = require("./database.js");
const { token } = require("./config/auth.json");
const { version, description } = require("../package.json");
const { prefix, owner, databasePath } = require("./config/config.json");


async function main() {
    const client = new Eris.CommandClient(token, {}, { prefix, owner, description });

    // Update the guild prefix's when they change
    const db = new Database(databasePath, (id, prefix) => client.registerGuildPrefix(id, prefix));
    await db.connect();

    client.on("ready", () => {
        console.log(`Logged in as ${client.user.username}#${client.user.discriminator}`);
        client.editStatus("online", { name: "Visual Studio Code" });
    });
    
    client.connect();
}

main();

