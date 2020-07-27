"use strict";

const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

/** Get a proxy mirroring the database */
module.exports.Database = async function(path) {
    const db = await open({ filename: path, driver: sqlite3.Database });
    const target = {};

    // Read all the tables in the database
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    for (const { name } of tables) {
        target[name] = {};
        const rows = await db.all(`SELECT * FROM ${name}`);
        for (const row of rows) {
            // Copy over the row with the id as the key 
            //  (the id is still in the object so anything that gets only the object knows the id)
            target[name][row.id] = new Proxy(row, {
                set(target, key, value) {
                    db.run(`UPDATE ${name} SET '${key}' = ? WHERE id = '${row.id}'`, [value]);
                    return Reflect.set(target, key, value);
                }
            });
        }
    }

    return target;
}