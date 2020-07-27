import { User, MessageEmbed } from "discord.js";
import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Avatar extends Command {
    constructor(client: Client) {
        super(client, {
            name: "avatar",
            memberName: "avatar",
            description: "Get the mentioned user's avatar",
            group: "misc",
            args: [
                {
                    key: "user",
                    prompt: "What user do you want to get the avatar of?",
                    type: "user"
                }
            ] 
        });
    }

    run(message: CommandoMessage, { user }: { user: User }) {
        const embed = new MessageEmbed({
            color: "#0099ff",
            title: user.tag,
            image: { url: user.avatarURL({ dynamic: true, format: "png", size: 512 }) }
        });
        return message.embed(embed);
    }
}