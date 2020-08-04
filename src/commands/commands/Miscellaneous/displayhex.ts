import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { Message, MessageEmbed } from "discord.js";

export default class DisplayHex extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "displayhex",
            group: "Miscellaneous",
            description: "Display the colour of a hex code, must be a valid 6 digit hex code",
            args: [
                {
                    name: "hex",
                    type: "string",
                    validate: (hex: string) => /^#?[0-9A-F]{6}$/i.test(hex),
                },
            ],
        });
    }

    run(message: Message, [hex]: [string]): void {
        // Automatically put a # before the hex code if it is missing
        hex = hex.startsWith("#") ? hex : "#" + hex;

        const embed = new MessageEmbed({
            color: hex,
            title: hex,
            image: { url: `https://www.colorhexa.com/${hex.substring(1)}.png` },
        });

        message.channel.send({ embed });
    }
}
