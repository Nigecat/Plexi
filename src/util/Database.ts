import sqlite from "sqlite3";

export default class Database {
    private connection: sqlite.Database;

    public constructor(path: string) {
        this.connection = new sqlite.Database(path);
    }

    public run(payload: string, args: Array<string> = []): void {
        this.connection.run(payload, args);
    }
}