const sqlite3 = require("sqlite3").verbose();

module.exports = class {
    constructor(path, default_token) {
        this.database = new sqlite3.Database(path);
        this.default_token = default_token

        // detect when process has exited
        process.on("exit", () => {
            this.database.close();
            process.exit();
        });
        // gets triggered when control c is pressed
        process.on("SIGINT", () => {
            this.database.close();
            process.exit();
        });
    }

    connect() {
        this.database.run(`CREATE TABLE IF NOT EXISTS Server  (            \
            id BIGINT NOT NULL UNIQUE PRIMARY KEY,                         \
            prefix TEXT NOT NULL DEFAULT '${this.default_token}'           \
        );`);
    }

    addServer(id) {
        this.database.run(`INSERT INTO Server ( id ) VALUES ( ${id} )`);
    }

    removeServer(id) {
        this.database.run(`DELETE FROM Server WHERE id = ${id}`);
    }

    updateServer(id, key, value) {
        this.database.run(`UPDATE Server SET ${key} = '${value}' WHERE id = ${id}`);
    }

    updateAll(guilds) {
        //guilds.forEach(guild => {
       ///     console.log(guild.id);
        //});
    }

    getServerInfo(id, callback) {
        this.database.get(`SELECT * FROM Server WHERE id = ${id}`, (err, row) => {
            callback(row);
        });
    }
}