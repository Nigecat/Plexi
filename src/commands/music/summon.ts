import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Leave extends Command {
    constructor(client: Client) {
        super(client, {
            name: "summon",
            memberName: "summon",
            group: "music",
            guildOnly: true,
            description: "Summon the bot into your voice channel"
        });
    }

    run(message: CommandoMessage) {
        if (message.member.voice.channel) {
            message.member.voice.channel.join();
            return Promise.resolve(undefined);
        } else {
            return message.say("You aren't in a voice channel!");
        }
    }
}