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
        this.database.run(`UPDATE User SET ${key} = ? WHERE id = ${id}`, value, err => console.log);
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

    // check if a user is currently in a match
    inMatch(id) {
        return new Promise((resolve, reject) => {
            this.database.get(`SELECT * FROM Game WHERE user1 = ${id} OR user2 = ${id} LIMIT 1`, (err, row) => {
                if (!err && row != undefined) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    updateGame(id, key, value, callback = () => {}) {
        this.getGame(id, row => {
            key = row.user1 == id ? `user1${key}` : `user2${key}`;
            this.database.run(`UPDATE Game SET ${key} = ? WHERE user1 = ${id} OR user2 = ${id}`, value, err => console.log);
            callback();
        });
    }

    updateGameVal(id, key, value) {
        this.database.run(`UPDATE Game SET ${key} = ? WHERE user1 = ${id} OR user2 = ${id}`, value, err => console.log);
    }


    getGame(id, callback) {
        this.database.get(`SELECT * FROM Game WHERE user1 = ${id} OR user2 = ${id} LIMIT 1`, (err, row) => {
            callback(row);
        });
    }

    // check if a game has expired and if so auto clear the rows (specified users)
    checkExpire(id) {
        return new Promise((resolve, reject) => {
            this.database.all(`SELECT * FROM Game WHERE user1 = ${id} OR user2 = ${id} LIMIT 1`, (err, rows) => {
                if (rows.length != 0) {
                    let time = Date.now();
                    rows.forEach(row => {
                        if (row.user1timeout - time < 0 || row.user2timeout - time < 0) {
                            this.database.run(`DELETE FROM Game WHERE user1 = ${row.user1} AND user2 = ${row.user2}`);
                        }
                    })
                    resolve();
                }
            }); 
        });
    }
}