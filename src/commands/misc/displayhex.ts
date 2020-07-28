import { Command, Client, CommandoMessage } from "discord.js-commando";
import { MessageEmbed } from "discord.js";

export default class DisplayHex extends Command {
    constructor(client: Client) {
        super(client, {
            name: "displayhex",
            memberName: "displayhex",
            group: "misc",
            description: "Display the colour of a hex code",
            args: [
                {
                    key: "hex",
                    prompt: "What hex code would you like to display?",
                    type: "string",
                    validate: (hex: string) => /^#?[0-9A-F]{6}$/i.test(hex)
                }
            ]
        });
    }

    run(message: CommandoMessage, { hex }: { hex: string }) {
        // Automatically put a # before the hex code if it is missing
        hex = hex.startsWith("#") ? hex : "#" + hex;

        const embed = new MessageEmbed({
            color: hex,
            title: hex,
            image: { url: `https://www.colorhexa.com/${hex.substring(1)}.png` }
        });

        return message.embed(embed);
    }
}