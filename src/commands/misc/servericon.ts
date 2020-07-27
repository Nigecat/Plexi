import { MessageEmbed } from "discord.js";
import { Command, Client, CommandoMessage } from "discord.js-commando";
import { runInNewContext } from "vm";

export default class ServerIcon extends Command {
    constructor(client: Client) {
        super(client, {
            name: "servericon",
            memberName: "servericon",
            group: "misc",
            guildOnly: true,
            description: "Get this server's icon"
        });
    }

    run(message: CommandoMessage) {
        const embed = new MessageEmbed({
            color: "#0099ff",
            title: message.guild.name,
            image: { url: message.guild.iconURL({ dynamic: true, format: "png", size: 512 }) }
        });
        return message.embed(embed);
    }
}