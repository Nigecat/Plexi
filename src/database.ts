import sqlite3 from "sqlite3";
import { Server } from "./types.js";
import { open, Database } from "sqlite";

export default class {
    public connection: Database;

    /**
     * @param path Database path
     * @param onPrefixChange Gets called when a server prefix changes
     */
    constructor(public path: string, public onPrefixChange: (id: string, newPrefix: string) => void) { }

    /** Connect to the database */
    async connect() {
        this.connection = await open({ filename: this.path, driver: sqlite3.Database });
    }

    /** Get a server in from database
     * 
     * @param id The id of the server to get
     */
    async getServer(id: string): Promise<Server> {
        return await this.getRow("Server", id);
    }

    /** Update a server in the database
     * 
     * @param id The id of the server to update
     * @param key The key to update
     * @param value The new value
     */
    async setServer(id: string, key: string, value: string) {
        await this.setRow("Server", id, key, value);
    }

    /** Get all the servers in the database */
    async getAllServers(): Promise<Server[]> {
        return await this.connection.all("SELECT * FROM Server");
    }   

    /** Execute sql in the database and get the result */
    async executeSql(sql: string) {
        return await this.connection.all(sql);
    }

    /** Get a row of data from the database
     * 
     * @param table The table to get the data from
     * @param id The of the row to get 
     */
    private async getRow(table: string, id: string) {
        const row = await this.connection.get(`SELECT * FROM ${table} WHERE id = ?`, [id]);
        // If the row does not exist in the database then add it
        if (row === undefined) {
            await this.connection.run(`INSERT OR IGNORE INTO ${table} ( id ) VALUES ( ? )`, [id]);
            return await this.getRow(table, id);
        }
        return row;
    }

    /** Update a row of data in the database
     * 
     * @param table The table to modify in
     * @param id The id of the row to modify the data of
     * @param key The column name of the value to modify
     * @param value The new value
     */
    private async setRow(table: string, id: string, key: string, value: string) {
        // Get the row to make sure it exists before we attempt to update it
        await this.getRow(table, id);
        await this.connection.run(`UPDATE ${table} SET ${key} = ? WHERE id = ${id}`, [value]);
    }
}