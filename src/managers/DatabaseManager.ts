import mongoose from "mongoose";
import { Plexi } from "../Plexi";
import { EventEmitter } from "events";

export default class DatabaseManager extends EventEmitter {
    /**
     * Create a database manager
     *
     * @param {Plexi} client - The client this manager belongs to
     * @param {string} uri - The url to connect to for the database
     */
    constructor(public readonly client: Plexi, private uri: string) {
        super();
    }

    /** Connect to the database */
    async init(): Promise<void> {
        await mongoose.connect(this.uri);
    }
}
