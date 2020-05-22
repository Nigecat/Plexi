import Database from "./Database.js";

export default class Server {
    public id: string;
    public prefix: string;
    public autorole: string;
    private database: Database;

    public constructor(id: string, database: Database) {
        this.id = id;
        this.database = database;
    }

    public async init(): Promise<void> {
        this.database.run("INSERT OR IGNORE INTO Server ( id ) VALUES ( ? )", [ this.id ]);
        const data: any = await this.database.get("SELECT * FROM Server WHERE id = ?", [ this.id ]);
        this.prefix = data[0].prefix;
        this.autorole = data[0].autorole;
    }

    public update(key: string, value: string): void {
        this[key] = value;
        this.database.run(`UPDATE Server SET ${key} = ? WHERE id = ?`, [value, this.id]);
    }
}