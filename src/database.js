const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

module.exports = class Database {
    /** onPrefixChange is a special callback that gets fired when a server prefix changes */
    constructor(path, onPrefixChange) {
        this.path = path;
        this.onPrefixChange = onPrefixChange;
    }

    async connect() {
        this.connection = await open({ filename: this.path, driver: sqlite3.Database });
    }

    async getServer(id) {
        return await this.#getRow("Server", id);
    }

    async setServer(id, key, value) {
        if (key === "prefix") this.onPrefixChange(id, value);
        await this.#setRow("Server", id, key, value);
    }

    async getAllServers() {
        return await this.connection.all(`SELECT * FROM Server`);
    }

    async disconnect() {
        await this.connection.disconnect();
    }


    /** Generic function to get a row from a table by the id */
    #getRow = async function(table, id) {
        const row = await this.connection.get(`SELECT * FROM ${table} WHERE id = ?`, [id]);
        // If this does not exist in the database then add it
        if (row === undefined) {
            await this.connection.run(`INSERT OR IGNORE INTO ${table} ( id ) VALUES ( ? )`, [id]);
            return await getRow(table, id);
        }
        return row;
    }
    
    /** Generic function to set a value of a row from a table by the id with the column */
    #setRow = async function(table, id, key, value) {
        // Get the row to make sure it exists before we attempt to update it
        await this.#getRow(table, id);
        await this.connection.run(`UPDATE Server SET ${key} = ? WHERE id = ${id}`, [value]);
    }
}