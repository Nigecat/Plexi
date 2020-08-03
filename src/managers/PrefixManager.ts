import * as Knex from "knex";
import { Plexi } from "../Plexi";
import { Collection, Guild, Snowflake } from "discord.js";
import { generateRegExp } from "../utils/misc";

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

    /** Fetch the prefix for a guild, this will return the value of the cache if it is already cached.
     *  Otherwise it will cache it and return the value;
     * @param {Guild | Snowflake} guild - The guild object or snowflake to retrieve
     */
    async fetch(guild: Guild | Snowflake): Promise<RegExp> {
        // Get the id from the guild object or just use the snowflake
        const id = typeof guild === "string" ? guild : guild.id;

        if (this.cache.has(id)) return this.cache.get(id);

        // Find if we have a prefix for this id saved
        const prefix = await this.database("prefixes").select("prefix").where({ id }).limit(1).first();

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
}
