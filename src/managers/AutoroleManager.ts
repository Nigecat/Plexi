import Knex from "knex";
import { Plexi } from "../Plexi";
import { EventEmitter } from "events";
import { Collection, Role, Snowflake } from "discord.js";

/** A manager of autoroles belonging to a client */
export default class AutoroleManager extends EventEmitter {
    /** The cache of autoroles of this manager */
    private cache: Collection<string, Role>;

    /**
     * Create an autorole manager
     *
     * @param {Plexi} client - The client this manager belongs to
     * @param {Knex} database - The database to store the data in
     */
    constructor(public readonly client: Plexi, private readonly database: Knex) {
        super();
        this.cache = new Collection();
    }

    /** Destroy the connection to the database */
    async destroy(): Promise<void> {
        this.emit("debug", "Disconnecting from database (autoroles)");
        await this.database.destroy();
    }

    /** Connect to the database and create the table if we need to */
    async init(): Promise<void> {
        this.emit("debug", "Connecting to database (autoroles)");
        // Create the table if it does not exist
        if (!(await this.database.schema.hasTable("autoroles"))) {
            await this.database.schema.createTable("autoroles", (table) => {
                table.string("id").primary().unique();
                table.string("autorole");
            });
        }
    }

    /**
     * Get an autorole, this will automatically pull from the cache if it exists there
     *
     * @param {Snowflake} guild - The id of the guild to get the autorole of
     * @returns {Role} The role object, this will be undefined if no autorole has been set
     */
    async get(guild: Snowflake): Promise<Role> {
        const id = guild;
        if (this.cache.has(id)) return this.cache.get(id);
        this.emit("debug", `Getting autorole for guild: ${id}`);
        const result = await this.database("autoroles").select("autorole").where({ id }).limit(1).first();
        if (result) {
            this.cache.set(id, this.client.guilds.cache.get(id).roles.cache.get(result.autorole));
            return this.cache.get(id);
        } else {
            return undefined;
        }
    }

    /**
     * Set an autorole, this will automatically update the databse
     *
     * @param {Snowflake} guild - The id of the guild to set the autorole of
     * @param {Snowflake} autorole - The id of the role to set
     */
    async set(guild: Snowflake, autorole: Snowflake): Promise<void> {
        const id = guild;
        this.emit("debug", `Setting autorole for guild: ${id} to ${autorole}`);
        // First we have to get it to see if it exists
        const current = await this.get(id);
        if (current) {
            await this.database("autoroles").where({ id }).update({ autorole });
        } else {
            await this.database("autoroles").insert({ id, autorole });
        }
        this.cache.set(id, this.client.guilds.cache.get(id).roles.cache.get(autorole));
    }

    /**
     * Delete an autorole, this will automatically update the database
     * @param {Snowflake} guild - The id of the guild to delete the autorole of
     */
    async del(guild: Snowflake): Promise<void> {
        const id = guild;
        this.emit("debug", `Deleting autorole for guild: ${id}`);
        this.cache.delete(id);
        await this.database("autoroles").where({ id }).del();
    }
}
