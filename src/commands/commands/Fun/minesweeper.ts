import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";

export default class MineSweeper extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "minesweeper",
            description: "Play a game of minesweeper",
            group: "Fun",
        });
    }
}
