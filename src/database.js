const sqlite3 = require("sqlite3").verbose();

module.exports = class {
    constructor(path, default_token) {
        this.database = new sqlite3.Database(path);
        this.default_token = default_token;     // legacy code cant remove
    }

    // this used to have code but then i removed it and cant delete the function
    // so it doesnt really do anything now
    connect(callback) {
        callback();
    }

    addServer(id) {
        this.database.run(`INSERT INTO Server ( id ) VALUES ( ${id} )`, err => {});
    }

    removeServer(id) {
        this.database.run(`DELETE FROM Server WHERE id = ${id}`);
    }

    addUser(id) {
        this.database.run(`INSERT INTO User ( id ) VALUES ( ${id} )`, err => {});
    }

    updateServer(id, key, value) {
        this.database.run(`UPDATE Server SET ${key} = ? WHERE id = ${id}`, value);
    }

    updateUser(id, key, value) {
        this.database.run(`UPDATE User SET ${key} = ? WHERE id = ${id}`, value);
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

    getUser(id, callback) {
        this.database.get(`SELECT * FROM User WHERE id = ${id}`, (err, row) => {
            callback(row);
        });
    }

    disconnect() {
        this.database.close();
    }
}