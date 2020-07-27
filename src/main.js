"use strict";

const Eris = require("eris");
const { Database } = require("./database.js");
const { token } = require("./config/auth.json");

Database("./src/data/data.sqlite").then(db => {
    const client = new Eris.CommandClient(token, {}, {
        prefix: "$",
        owner: "<@307429254017056769>",
        description: "A general purpose discord bot"
    });
    
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.username}#${client.user.discriminator}`);
    });
    
    client.connect();
});

