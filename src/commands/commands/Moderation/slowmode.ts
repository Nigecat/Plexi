import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { Message, TextChannel } from "discord.js";

export default class SlowMode extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "slowmode",
            group: "Moderation",
            description:
                "Sets the slowmode of a channel, can be set to any number (in seconds) - unlike the channel settings!",
            guildOnly: true,
            args: [
                {
                    name: "seconds",
                    type: "number",
                },
            ],
        });
    }

    run(message: Message, [seconds]: [number]): void {
        ((message.channel as unknown) as TextChannel).setRateLimitPerUser(
            seconds,
            `Rate limit change run by ${message.author.tag} | ${message.author.id}`,
        );
        message.channel.send(`${message.channel} slowmode set to ${seconds} seconds!`);
    }
}
