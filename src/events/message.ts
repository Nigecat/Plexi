import { Plexi } from "../Plexi";
import { Message } from "discord.js";

export default async function (message: Message, client: Plexi): Promise<void> {
    // Figure out what prefix we are using for this server
    const prefix = client.prefixes
        ? client.prefixes.cache.has(message.guild.id)
            ? client.prefixes.cache.get(message.guild.id)
            : await client.prefixes.fetch(message.guild)
        : client.defaultPrefix;

    console.log(prefix);
}
