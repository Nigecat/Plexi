import { SnowflakeUtil } from "discord.js";

function formatSnowflake(snowflake) {
    const date = SnowflakeUtil.deconstruct(snowflake).date;
    return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
}


export function getGuild(client, pos) {
    return client.guilds.cache.get(pos.split("/")[1]);
}

export function validURLImage(url) {
    // true if this url is a png or jpg image.
    return url.endsWith("png") || url.endsWith("jpg");
}

export function formatMessage(message) {
    if (message.type === "GUILD_MEMBER_JOIN") return `\u001b[31m${message.author.id}@${message.author.tag} joined the server!\x1b[0m`;
    else if (message.attachments.size > 0) return `\u001b[34m${formatSnowflake(message.id)} ${message.author.id}@${message.author.tag}\x1b[0m \u001b[36m${Array.from(message.attachments.values()).map(attachment => attachment.attachment)[0]}\x1b[0m`;
    else return `\u001b[34m${formatSnowflake(message.id)} ${message.author.id}@${message.author.tag}\x1b[0m \u001b[36m${message.content}\x1b[0m`;
}