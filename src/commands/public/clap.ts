import { Message, Collection, Snowflake } from "discord.js";

export default {
    description: "Put the 👏 emoji in the spaces of the previous message",
    async call (message: Message): Promise<void> {
        const messages: Collection<Snowflake, Message> = await message.channel.messages.fetch({ limit: 2 });
        message.channel.send(`👏 ${messages.last().content.replace(" ", "👏")} 👏`);
    }
}