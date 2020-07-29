import { open, Database } from "sqlite";
import { Database as sqlite3Database } from "sqlite3";

export default class DataStore {
    private connection: Database;

    constructor(private filename: string, public readonly namespace: string) { }

    /** Convert an id to the id used in the database (namespace:id) */
    private translateID(id: string) {
        return `${this.namespace}:${id}`;
    }

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
        console.log(`Setting value for ${this.translateID(id)} to ${value}`);
        // First we get the value to check if it exists
        if (await this.get(id)) {
            // If this id already exists then we update it
            await this.connection.run("UPDATE data SET value = ? WHERE id = ?", [value, this.translateID(id)]);
        }
        // Otherwise we insert a new row
        else {
            await this.connection.run("INSERT INTO data ( id, value ) VALUES ( ?, ? )", [this.translateID(id), value]);
        }
    }

    /** Get a value */
    async get(id: string): Promise<string> {
        console.log(`Retrieving value for ${this.translateID(id)}`);
       const result = await this.connection.get("SELECT value FROM data WHERE id = ?", [this.translateID(id)]);
       // If we found something
       if (result) {
           return result.value;
       }
       // Otherwise just return undefined
       else {
           return undefined;
       }
    }

    /** Delete a value */
    async delete(id: string) {
        console.log(`Deleting value for ${this.translateID(id)}`);
        await this.connection.run("DELETE FROM data WHERE id = ?", [this.translateID(id)]);
    }
}