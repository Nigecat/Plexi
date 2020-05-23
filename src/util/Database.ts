import sqlite from "sqlite3";
import log from "./logger.js";
import { Collection, Snowflake } from "discord.js";

export default class Database {
    private connection: sqlite.Database;

    public constructor(path: string) {
        log("database", `Creating new database connection for ${path}`);
        this.connection = new sqlite.Database(path);
    }

    public run(payload: string, args: string[] = []): void {
        log("database", `Running payload  [${payload}]  with args (${args.join(", ")})`);
        this.connection.run(payload, args);
    }

    public async getTop(top: string): Promise<any> {
        return new Promise((resolve, reject) => {
            log("database", `Getting top for [${top}]`);
            this.connection.all(`SELECT id, ${top} FROM User ORDER BY ${top} DESC LIMIT 10`, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    public get(query: string, args: string[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            log("database", `Running query  [${query}]  with args (${args.join(", ")})`);
            this.connection.all(query, args, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }
}