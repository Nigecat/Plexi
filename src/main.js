"use strict";

const Eris = require("eris");
const { Database } = require("./database.js");
const { token } = require("./config/auth.json");
const { version, description } = require("../package.json");
const { prefix, owner, databasePath } = require("./config/config.json");


async function main() {
    const client = new Eris.CommandClient(token, {}, { prefix, owner, description });

    // Create a database connection, this is a proxy that automatically reflects any changes we make to it in the actual database
    //  We also create an onchange even that updates the eris guild prefix if it is changed in our object
    const db = await Database(databasePath, (id, key, value) => { if (key == "prefix") client.registerGuildPrefix(id, value) });

    client.on("ready", () => {
        console.log(`Logged in as ${client.user.username}#${client.user.discriminator}`);
    });
    
    // Register all the different server prefixes
    Object.keys(db.Server).forEach(id => client.registerGuildPrefix(id, db.Server[id].prefix));
    
    client.connect();
}

main();

