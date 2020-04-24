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

    connect(callback) {
        this.database.run(`CREATE TABLE IF NOT EXISTS Server  (            \
            id BIGINT NOT NULL UNIQUE PRIMARY KEY,                         \
            prefix TEXT NOT NULL DEFAULT '${this.default_token}'           \
        );`);
        callback();
    }

    addServer(id) {
        this.database.run(`INSERT INTO Server ( id ) VALUES ( ${id} )`, err => {});
    }

    removeServer(id) {
        this.database.run(`DELETE FROM Server WHERE id = ${id}`);
    }

    updateAll(guilds) {
        // update the database to make sure it is up to date with any new guilds
        this.database.serialize(() => {
            guilds.cache.array().forEach(guild => {
                this.addServer(guild.id);
            });
        });
    }

    getServerInfo(id, callback) {
        this.database.get(`SELECT * FROM Server WHERE id = ${id}`, (err, row) => {
            callback(row);
        });
    }
}