import { open, Database } from "sqlite";
import { Database as sqlite3Database } from "sqlite3";

export default class DataStore {
    private connection: Database;

    constructor(private filename: string, public readonly namespace: string) { }

    /** Connect to the database */
    async connect() {
        console.log(`Connecting to database ${this.filename} with namespace: ${this.namespace}`);
        this.connection = await open({ filename: this.filename, driver: sqlite3Database });
        this.connection.run(`CREATE TABLE IF NOT EXISTS "data" (
            "id"	TEXT NOT NULL UNIQUE,
            "value"	TEXT,
            PRIMARY KEY("id")
        );`);
    }

    /** Disconnect from the database */
    async disconnect() {
        await this.connection.close();
    }

    /** Set a value */
    async set(id: string, value: string) {
        console.log(`Setting value for ${this.namespace}:${id} to ${value}`);
        await this.connection.run("INSERT OR REPLACE INTO data ( id, value ) VALUES ( ?, ? )", [`${this.namespace}:${id}`, value, value]);
    }

    /** Get a value */
    async get(id: string) {
        console.log(`Retrieving value for ${this.namespace}:${id}`);
        return await this.connection.get("SELECT value FROM data WHERE id = ?", [id]);
    }

    /** Delete a value */
    async delete(id: string) {
        console.log(`Deleting value for ${this.namespace}:${id}`);
        await this.connection.run("DELETE FROM data WHERE id = ?", [id]);
    }
}