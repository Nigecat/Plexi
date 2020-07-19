import sqlite3 from "sqlite3";
import { existsSync } from "fs";

export default class Database {
    connection: sqlite3.Database;

    constructor(path: string) {
        // If the database file does not exist then we setup one
        if (!existsSync(path)) {
            // This will automatically create a blank database file
            this.connection = new sqlite3.Database(path);
            // Create our tables
            this.connection.run(`CREATE TABLE "Server" (
                "id"	    TEXT NOT NULL UNIQUE,
                "autorole"	TEXT,
                "prefix"	TEXT NOT NULL DEFAULT '$',
                PRIMARY KEY("id")
            );`);
            this.connection.run(`CREATE TABLE "User" (
                "id"	    TEXT NOT NULL UNIQUE,
                "coins"	    INTEGER NOT NULL DEFAULT 500,
                "peanuts"	INTEGER NOT NULL DEFAULT 0,
                PRIMARY KEY("id")
            );`);

        // Otherwise just connect to it
        } else {
            this.connection = new sqlite3.Database(path);
        }
    }

    /** Get a row from the database */
    get(table: string, id: string): Promise<any> {
        return new Promise(resolve => {
            this.connection.get(`SELECT * FROM ${table} WHERE id = ?`, [id], (err, row) => {
                // If the data wasn't found then we create it and call ourself again to read it
                if (!row) {
                    this.connection.run(`INSERT INTO ${table} ( id ) VALUES ( ? )`, [id]);
                    resolve(this.get(table, id));
                } else {
                    resolve(row);
                }
            });
        });
    }

    /** Update data in the database */
    set(table: string, id: string, key: string, value: string): Promise<any> {
        return new Promise(resolve => {
            this.connection.run(`UPDATE ${table} SET ${key} = ? WHERE id = ?`, [value, id], err => {
                resolve();
            });
        });
    }

    /** Close the database connection for this class */
    close() {
        return new Promise(resolve => {
            this.connection.close(() => { resolve() });
        });
    }
}