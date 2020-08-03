import winston from "winston";
import { Client, ClientOptions } from "discord.js";

/**
 * An extended version of the discord.js client
 * @param {ClientOptions} options - The options for the client
 */
export class Plexi extends Client {
    constructor(options: ClientOptions) {
        super(options);
    }
}
