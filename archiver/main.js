import { Client, MessageEmbed } from "discord.js";
import Archiver from "./archiver.js";
import auth from "../src/data/auth.json";
const client = new Client();
const archiver = new Archiver(client, ["307429254017056769", "547881813088010241"]);    // Only these people can run an archive

client.on("debug", data => {   
    // Only display debug info if an archive is not actively running,
    //  since it messes up the progress bars
    if (!archiver.active) console.log(data);
}); 

client.on("ready", () => {
    console.log("\u001b[32mReady to begin archiving!\u001b[0m");
});

client.on("message", message => {
    // If the is on our whitelist
    if (archiver.whitelist.includes(message.author.id)) {
        // Valid commands are: a%help | a%clone | a%resume

        if (message.content.startsWith("a%help")) {
            message.channel.send(`\`\`\`markdown
# Usage:
    a%info <serverID>
        Get server info

    a%clone <targetChannelID> <destinationChannelID>
        This will clone the contents of a channel to another channel

    a%resume <targetChannelID> <destinationChannelID>
        Assuming destination channel has previously had a clone run targeted at it,
        and the targetChannelID is the same as the clone,
        this command will resume where the clone left off.
        This can be used to update a clone once new messages
            have been sent in the original channel.
            \`\`\``);
        }

        else if (message.content.startsWith("a%info")) {
            const server = client.guilds.cache.get(message.content.split(" ")[1]);
            const embed = new MessageEmbed()
                .setTitle(server.name)
                .setThumbnail(server.iconURL())
                .addField("ID:", server.id)
                .addField("Created at:", server.createdAt)
                .addField("Owner:", `${server.owner} (${server.ownerID})`);
            message.channel.send({ embed });
        }

        else if (message.content.startsWith("a%clone") || message.content.startsWith("a%resume")) {
            const targetChannel = message.content.split(" ")[1];
            const destinationChannel = message.content.split(" ")[2];
    
            // Ensure both channels are found in the client's channel cache
            if (client.channels.cache.has(targetChannel) && client.channels.cache.has(destinationChannel)) {
                if (message.content.startsWith("a%clone")) {
                    archiver.clone(message.channel, client.channels.cache.get(targetChannel), client.channels.cache.get(destinationChannel));
                } else if (message.content.startsWith("a%resume")) {
                    archiver.resume(message.channel, client.channels.cache.get(targetChannel), client.channels.cache.get(destinationChannel));
                }
            } else {
                message.channel.send("Channel not found! One of the channels you specified could not be found... Maybe this bot is not in the server that the channel resides in.")
            }
        }
    }
});

client.login(auth.token);