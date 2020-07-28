import { Command, Client, CommandoMessage } from "discord.js-commando";

export default class Worm extends Command {
    constructor(client: Client) {
        super(client, {
            name: "worm",
            memberName: "worm",
            group: "misc",
            description: "Make a worm of the specified length",
            args: [
                {
                    key: "length",
                    prompt: "How long do you want this worm to be?",
                    type: "integer"
                }
            ]
        });
    }

    run(message: CommandoMessage, { length }: { length: number } ) {
        const worm = `<:h_:708133267366477944>${"<:b_:708133266644926505>".repeat(length)}<:t_:708133266657640578>`;

        // Only respond if we are under the max message character limit
        if (worm.length > 2000) {
            return message.say("That worm would be too long to post!");
        } else {
            return message.say(worm);
        }
    }
}