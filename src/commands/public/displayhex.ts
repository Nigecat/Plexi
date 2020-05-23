import { Message, MessageEmbed } from "discord.js";
import Command from "../../util/Command.js";

export default <Command> {
    args: ["hex-code"],
    description: "Display a hex code (must be 6 characters)",
    call (message: Message, args: string[]): void {
        // Automatically put a # before the hex code if it is missing
        const hex: string = args[0].startsWith("#") ? args[0] : `#${args[0]}`;

        if (hex.length !== 7) {
            message.channel.send("Invalid hex code");
        } else {
            const embed: MessageEmbed = new MessageEmbed()
                .setColor(hex)
                .setTitle(hex)
                .setImage(`https://www.colorhexa.com/${hex.split("#")[1]}.png`);

            message.channel.send({ embed });  
        }
    }
}