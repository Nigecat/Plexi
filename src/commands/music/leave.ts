import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Leave extends Command {
    constructor(client: Client) {
        super(client, {
            name: "leave",
            memberName: "leave",
            aliases: ["disconnect"],
            group: "music",
            guildOnly: true,
            description: "Make the bot leave it's current voice channel (you must be in the channel with it)",
            userPermissions: ["MOVE_MEMBERS"]
        });
    }

    run(message: CommandoMessage) {
        if (message.guild.me.voice.channel.id === message.member.voice.channel.id) {
            message.guild.me.voice.channel.leave();
            return Promise.resolve(undefined);
        } else {
            return message.say("You aren't in a voice channel with me!");
        }
    }
}