import chalk from "chalk";
import Database from "./models/database.js";
import { Client, Message } from "discord.js";
import processCommand from "./commandHelper.js";

export default class Plexi {
    client: Client;
    database: Database;

    constructor(private token: string, databasePath: string, public owner: string) {
        this.database = new Database(databasePath);

        this.client = new Client({ presence: { status: "online", activity: { type: "PLAYING", name: "$help" } } });
        this.client.on("debug", console.log);
        this.client.on("message", this.processMessage.bind(this));
        this.client.on("ready", () => { console.log(chalk.greenBright(`Logged in as ${this.client.user.tag}`)) });
    }

    /** Start the bot */
    start() {
        this.client.login(this.token);
    }

    /** Process an incoming message */
    private async processMessage(message: Message) {
        // Prevent the bot from responding to other bots and in dm channels
        if (!message.author.bot && message.guild) {
            // Send the message through to the general command processing function
            processCommand(message, this.database, this.client, this.owner);


            /*  Special handlers  */

            // @someone feature replication see https://youtu.be/BeG5FqTpl9U
            //  Requires a role called 'someone' to exist
            if (message.mentions.roles.size > 0 && message.mentions.roles.some(role => role.name == "someone")) {
                // Assign the 'someone' role to a random member
                const member = await message.guild.members.cache.random().roles.add(message.guild.roles.cache.find(role => role.name == "someone"));

                // Ping the @someone role, this will ping the person who it was assigned to
                const msg = await message.channel.send("<@&" + message.guild.roles.cache.find(role => role.name == "someone").id + ">");
                
                // Delete the role ping message
                msg.delete();
                
                // Remove the role from the user
                member.roles.remove(message.guild.roles.cache.find(role => role.name == "someone"));
            }


            // Custom code for 264163117078937601 (Pinpointpotato#9418) AKA the ideas man
            if (message.author.id === "264163117078937601" && message.content.toLowerCase().includes("you know why they call me the ideas man")) {
                message.channel.send("cuz i CLEEEEEEAaaan up");
            }
        }
    }
}