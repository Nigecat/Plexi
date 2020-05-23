import { Message } from "discord.js";
import Command from "../../util/Command.js";

function mod(a: number, b: number): number {
    const c: number = a % b;
    return (c < 0) ? c + b : c;
}

function compare(choice1: string, choice2: string, choices: string[]): string {
    const x: number = choices.indexOf(choice1);
    const y: number = choices.indexOf(choice2);
    if (x === y) {
        return "it is a tie!";
    }
    if (mod((x - y), choices.length) < choices.length / 2) {
        return choice1 + " wins!";
    } else {
        return choice2 + " wins!";
    }
}

export default <Command> {
    args: ["rock|paper|scissors"],
    description: "Play rock paper scissors against the bot",
    call (message: Message, args: string[]) {
        const choices: string[] = ["rock", "paper", "scissors"];

        const choice1: string = args[0];
        const choice2: string = choices[Math.floor(Math.random() * choices.length)];;

        message.channel.send(`You play ${choice1}, I play ${choice2}, ${compare(choice1, choice2, choices)}!`);
    }
}