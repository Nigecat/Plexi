import { Plexi } from "../Plexi";
import { EventEmitter } from "events";
import { Snowflake } from "discord.js";
import mongoose, { Schema, Document } from "mongoose";

export default class DatabaseManager extends EventEmitter {
    private Guild: mongoose.Model<mongoose.Document, Record<string, Schema<Guild>>>;
    private User: mongoose.Model<mongoose.Document, Record<string, Schema<User>>>;

    /**
     * Create a database manager
     *
     * @param {Plexi} client - The client this manager belongs to
     * @param {string} uri - The uri to connect to for the database
     */
    constructor(public readonly client: Plexi, private uri: string) {
        super();
        this.Guild = mongoose.model(
            "Guild",
            new Schema({
                id: String,
                autorole: { type: String, default: null },
                prefix: { type: String, default: client.config.prefix },
            }),
        );

        this.User = mongoose.model(
            "User",
            new Schema({
                id: String,
                cards: [String],
                deck: [String],
                lock: { type: Boolean, default: false },
                dailyClaimTime: Date,
                xp: { type: Number, default: 0 },
                coins: { type: Number, default: 500 },
            }),
        );
    }

    /** Connect to the database */
    async init(): Promise<void> {
        await mongoose.connect(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        this.client.emit(
            "debug",
            `Connecting to database at ${this.uri.split("://")[0]}://${"*".repeat(this.uri.split("://")[1].length)}`,
        );
    }

    /** Disconnect from the database */
    async disconnect(): Promise<void> {
        this.client.emit("debug", "Disconnecting from database");
        await mongoose.disconnect();
    }

    /**
     * Get a guild from the database, if it does not exist it will be created
     * @param {Snowflake} id - The id of the guild to get
     * @returns {Guild} The guild
     */
    async getGuild(id: Snowflake): Promise<Guild> {
        const res = await this.Guild.find({ id });
        if (res.length > 0) {
            return res[0] as Guild;
        } else {
            return (await this.Guild.create({ id })) as Guild;
        }
    }

    /**
     * Update a guild in the database, if it does not exist it will be created
     * @param {Snowflake} id - The id of the guild to update
     * @param {string} key - The key to update
     * @param {any} value - The new value of this key
     * @returns {Guild} The updated guild
     */
    async updateGuild(id: Snowflake, key: string, value: Guild[keyof Guild]): Promise<Guild> {
        const guild = await this.getGuild(id);
        this.client.emit("debug", `Updating guild: ${id} (${key}:${guild[key]} -> ${key}:${value})`);
        guild[key] = value;
        return (guild.save() as unknown) as Guild;
    }

    /**
     * Delete a guild
     * @param {Snowflake} id - The id of the guild to delete
     * @returns {boolean} The status of the delete
     */
    async deleteGuild(id: Snowflake): Promise<boolean> {
        this.client.emit("debug", `Deleting guild: ${id}`);
        return !!+(await this.Guild.deleteOne({ id })).ok;
    }

    /**
     * Get a user from the database, if it does not exist it will be created
     * @param {Snowflake} id - The id of the user to get
     * @returns {User} The user
     */
    async getUser(id: Snowflake): Promise<User> {
        const res = await this.User.find({ id });
        if (res.length > 0) {
            return res[0] as User;
        } else {
            return (await this.User.create({ id })) as User;
        }
    }

    /**
     * Update a user in the database, if it does not exist it will be created
     * @param {Snowflake} id - The id of the user to update
     * @param {string} key - The key to update
     * @param {any} value - The new value of this key
     * @returns {User} The updated user
     */
    async updateUser(id: Snowflake, key: string, value: User[keyof User]): Promise<User> {
        const user = await this.getUser(id);
        // Only proceed if the user is not locked (unless we are trying to change the lock)
        if (key === "lock" || !user.lock) {
            this.client.emit("debug", `Updating user: ${id} (${key}:${user[key]} -> ${key}:${value})`);
            user[key] = value;
            return (user.save() as unknown) as User;
        } else {
            return user;
        }
    }

    /** Get all users in the database */
    async allUsers(): Promise<User[]> {
        return ((await this.User.find({})) as unknown[]) as User[];
    }

    /**
     * Delete a user
     * @param {Snowflake} id - The id of the user to delete
     * @returns {boolean} The status of the delete
     */
    async deleteUser(id: Snowflake): Promise<boolean> {
        this.client.emit("debug", `Deleting user: ${id}`);
        return !!+(await this.User.deleteOne({ id })).ok;
    }
}

export interface Guild extends Omit<Document, "save"> {
    id: string;
    autorole: string;
    prefix: string;
    save: Document["save"];
}

export interface User extends Omit<Document, "save"> {
    id: string;
    xp: number;
    cards: string[];
    deck: string[];
    dailyClaimTime: Date;
    coins: number;
    lock: boolean;
    save: Document["save"];
}
