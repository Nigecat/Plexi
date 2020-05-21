import Database from "./Database.js";

export default class Server {
    public id: string;
    public prefix: string;
    private database: Database;

    public constructor(id: string, database: Database, prefix: string = "$") {
        this.id = id;
        this.database = database;
        this.prefix = prefix;
        this.database.run("INSERT OR IGNORE INTO Server ( id, prefix ) VALUES ( ?, ? )", [id, prefix]);
    }

    public update(key: string, value: string): void {
        this.database.run("UPDATE Server SET ? = ? WHERE id = ?", [key, value, this.id]);
    }
}