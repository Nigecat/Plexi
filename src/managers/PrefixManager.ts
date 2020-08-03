import { Plexi } from "../Plexi";
import { Collection, Guild, Snowflake } from "discord.js";

/**
 * A manager of prefixes belonging to a client
 */
export default class PrefixManager {
    /** The client this manager belongs to */
    public readonly client: Plexi;

    /** The cache of prefixes of this manager,
     *  these are stored by regular expressions which will match the prefix and a client mention */
    public readonly cache: Collection<string, RegExp>;

    /** Create a prefix manager
     * @param {Plexi} client - The client this manager belongs to
     */
    constructor(client: Plexi) {
        this.client = client;
        this.cache = new Collection();
    }

    /** Fetch the prefix for a guild, this will return the value of the cache if it is already cached.
     *  Otherwise it will cache it and return the value;
     * @param {Guild | Snowflake} guild - The guild object or snowflake to retrieve
     */
    async fetch(guild: Guild | Snowflake): Promise<RegExp> {
        // Get the id from the guild object or just use the snowflake
        const id = typeof guild === "string" ? guild : guild.id;
        console.log(id);

        return new RegExp("");
    }
}
