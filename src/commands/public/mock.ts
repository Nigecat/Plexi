import { Message, MessageEmbed } from "discord.js";
import { lastMessage } from "../../util/util.js";
import Command from "../../util/Command.js";

export default Command.create({
    description: "Mock the previous message",
    async call (message: Message): Promise<void> {
        const data: Message = await lastMessage(message.channel);

        // Random the case of every character in the text to mock
        const mock: string = data.content.split("").map(l => Math.floor((Math.random() * 2) + 1) === 1 ? l.toLowerCase() : l.toUpperCase()).join("");
        
        const embed: MessageEmbed = new MessageEmbed()
            .setColor("#7289DA")
            .setTitle(`${mock} - ${data.author.tag}`)
            .attachFiles(["./commands/resources/spongebob_mocking.png"])
            .setImage('attachment://spongebob_mocking.png');
        
        message.channel.send({ embed });
    }
});