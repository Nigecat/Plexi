import { Message } from "discord.js";
import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";
import { stripIndents } from "common-tags";

export default class RPS extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "rps",
            group: "Economy",
            description: "Play rock paper scissors against me",
            details: stripIndents`
                If you win you gain the amount of coins you bet, if you lose then you lose that many coins. 
                A draw results in nothing happening.
            `,
            args: [
                {
                    name: "bet",
                    type: "number",
                },
                {
                    name: "move",
                    type: "string",
                    oneOf: ["rock", "paper", "scissors"],
                },
            ],
        });
    }

    async run(message: Message, [bet]: [number]): Promise<void> {
        // Check if the user has enough coins
        const user = await this.client.database.getUser(message.author.id);
        if (bet >= 0 && user.coins < bet) {
            message.channel.send("You don't have enough coins to bet that much!");
        } else {
            // Weight the winner
            // 0 - user loses
            // 1 - draw
            // 2 - user wins
            const winner = [0, 0, 0, 1, 1, 1, 2, 2][Math.floor(Math.random() * 9)];

            // If the user lost
            if (winner === 0) {
                message.channel.send(`You lose! You just lost ${bet} coins.`);
                await this.client.database.updateUser(message.author.id, "coins", user.coins - bet);
            } else if (winner === 1) {
                // If it is a draw
                message.channel.send("It's a draw! Nothing happened...");
            } else if (winner === 2) {
                // If the user won
                message.channel.send(`You win! You just gained ${bet} coins.`);
                await this.client.database.updateUser(message.author.id, "coins", user.coins + bet);
            }
        }
    }
}
