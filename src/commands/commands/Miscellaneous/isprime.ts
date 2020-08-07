import { Command } from "../../Command";
import { Plexi } from "../../../Plexi";
import { Message } from "discord.js";

export default class IsPrime extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "isprime",
            description: "Check if a number is a prime (NOTE: Will prevent the command from running at ~300 digits)",
            group: "Miscellaneous",
            args: [
                {
                    name: "number",
                    type: "number",
                },
            ],
        });
    }

    run(message: Message, [num]: [number]): void {
        if (this.isPrime(num)) {
            message.channel.send(`**${num}** is a prime number.`);
        } else {
            message.channel.send(`**${num}** is not a prime number.`);
        }
    }

    /** Check if a number is prime */
    isPrime(num: number): boolean {
        if (isNaN(num) || !isFinite(num) || num % 1 || num < 2) return false;
        if (num % 2 === 0) return num === 2;
        if (num % 3 === 0) return num === 3;

        for (let i = 5; i <= Math.sqrt(num); i += 6) {
            if (num % i === 0) return false;
            if (num % (i + 2) === 0) return false;
        }

        return true;
    }
}
