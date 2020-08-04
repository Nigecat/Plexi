import * as Knex from "knex";
import { Plexi } from "../Plexi";
import { generateRegExp } from "../utils/misc";
import { Collection, Snowflake } from "discord.js";

/** A manager of prefixes belonging to a client */
export default class PrefixManager {
    /** The cache of prefixes of this manager */
    private cache: Collection<string, RegExp>;

    /**
     * Create a prefix manager
     *
     * @param {Plexi} client - The client this manager belongs to
     * @param {Knex} database - The database to store the data in
     */
    constructor(public readonly client: Plexi, private readonly database: Knex) {
        this.cache = new Collection();
    }

    /** Destroy the connection to the database */
    async destroy(): Promise<void> {
        await this.database.destroy();
    }

    /** Connect to the database and create the table if we need to */
    async init(): Promise<void> {
        // Create the table if it does not exist
        if (!(await this.database.schema.hasTable("prefixes"))) {
            await this.database.schema.createTable("prefixes", (table) => {
                table.string("id").primary().unique();
                table.string("prefix");
            });
        }
    }

    async get(guild: Snowflake): Promise<RegExp>;
    async get(guild: Snowflake, getRaw: boolean): Promise<string>;

    /**
     * Get a prefix, this will automatically pull from the cache if it exists there
     *
     * @param {Snowflake} guild - The id of the guild to get the prefix of
     * @param getRaw [getRaw=false] - Whether to get the raw prefix,
     *                          if this is true then this function will not return a regular expression,
     *                          but the direct string representation of the prefix.
     * @returns {RegExp | string} The prefix, this will be the default prefix if it is not found
     */
    async get(guild: Snowflake, getRaw = false): Promise<RegExp | string> {
        const id = guild;
        if (this.cache.has(id)) return this.cache.get(id);
        const result = await this.database("prefixes").select("prefix").where({ id }).limit(1).first();
        if (getRaw) {
            return result ? result.prefix : this.client.config.prefix;
        } else {
            return result ? generateRegExp(result.prefix, this.client.user.id) : this.client.defaultPrefix;
        }
    }

    /**
     * Set a prefix, this will automatically update the databse
     *
     * @param {Snowflake} guild - The id of the guild to set the prefix of
     * @param {string} prefix - The prefix set
     */
    async set(guild: Snowflake, prefix: string): Promise<void> {
        const id = guild;
        // First we have to get it to see if it exists
        const current = await this.get(id);
        if (current) {
            await this.database("prefixes").where({ id }).update({ prefix });
        } else {
            await this.database("prefixes").insert({ id, prefix });
        }
        this.cache.set(id, generateRegExp(prefix, this.client.user.id));
    }
}
