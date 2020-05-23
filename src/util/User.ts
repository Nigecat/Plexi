import Database from "./Database";

export default class User {
    public id: string;
    public peanuts: string;
    private database: Database;

    public constructor(id: string, database: Database) {
        this.id = id;
        this.database = database;
    }

    public async init(): Promise<void> {
        this.database.run("INSERT OR IGNORE INTO User ( id ) VALUES ( ? )", [ this.id ]);
        const data: any = await this.database.get("SELECT * FROM User WHERE id = ?", [ this.id ]);
        this.peanuts = data[0].peanuts;
    }

    public update(key: string, value: string): void {
        this[key] = value;
        this.database.run(`UPDATE User SET ${key} = ? WHERE id = ?`, [value, this.id]);
    }
}