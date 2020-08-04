import * as Knex from "knex";
import { Plexi } from "../Plexi";
import { generateRegExp } from "../utils/misc";
import { Collection, Snowflake } from "discord.js";

/**
 * A manager of prefixes belonging to a client
 */
export default class PrefixManager {
    /** The cache of prefixes of this manager,
     *  these are stored by regular expressions which will match the prefix and a client mention */
    public readonly cache: Collection<string, RegExp>;

    /** Create a prefix manager
     * @param {Plexi} client - The client this manager belongs to
     * @param {Knex} database - The databse to store the data in
     */
    constructor(public readonly client: Plexi, private readonly database: Knex) {
        this.cache = new Collection();
    }

    /** Destroy the connection to the database */
    async destroy(): Promise<void> {
        await this.database.destroy();
    }

    /** Connect to the database and load the values */
    async init(): Promise<void> {
        // Create the table if it does not exist
        if (!(await this.database.schema.hasTable("prefixes"))) {
            await this.database.schema.createTable("prefixes", (table) => {
                table.string("id").primary().unique();
                table.string("prefix");
            });
        }

        // Read all the data and load it into our collection
        const rows = await this.database("prefixes").select("*");
        rows.forEach((row) => this.cache.set(row.id, generateRegExp(row.prefix, this.client.user.id)));
    }

    /**
     * Get the raw prefix for a guild, this directly queries the database
     * @param {Snoflake} id - The guild to get the prefix of
     */
    async getRaw(id: Snowflake): Promise<string> {
        return await this.database("prefixes").select("prefix").where({ id }).limit(1).first();
    }

    /** Fetch the prefix for a guild, this will return the value of the cache if it is already cached.
     *  Otherwise it will cache it and return the value;
     * @param {Snowflake} id - The guild id to retrieve
     */
    async fetch(id: Snowflake): Promise<RegExp> {
        if (this.cache.has(id)) return this.cache.get(id);

        // Find if we have a prefix for this id saved
        const prefix = await this.getRaw(id);

        // If we do then convert it into a regular expression, add it do the cache and return it
        if (prefix) {
            const regex = generateRegExp(prefix, this.client.user.id);
            this.cache.set(id, regex);
            return regex;
        } else {
            // Otherwise return the default prefix regex
            return this.client.defaultPrefix;
        }
    }

    /** Set a prefix
     * @param {Snowflake} guild - The guild id to set
     * @param {string} prefix - The prefix
     */
    async set(id: Snowflake, prefix: string): Promise<void> {
        this.cache.set(id, generateRegExp(prefix, this.client.user.id));
        this.database("prefixes").where({ id }).update({ prefix });
    }
}
