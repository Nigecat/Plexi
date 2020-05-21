import { Message, Collection, Snowflake, TextChannel, DMChannel, NewsChannel } from "discord.js";

export async function lastMessage(channel: (TextChannel | DMChannel | NewsChannel)): Promise<Message> {
    return new Promise(async resolve => {
        const messages: Collection<Snowflake, Message> = await channel.messages.fetch({ limit: 2 });
        resolve(messages.get(Array.from(messages.keys())[1]));
    });
}

export function sendMarkdown(channel: (TextChannel | DMChannel | NewsChannel), data: string[]): void {
    channel.send(`\`\`\`markdown\n${data.join("\n")}\`\`\``);
}