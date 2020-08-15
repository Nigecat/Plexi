import { Plexi } from "../../../Plexi";
import { Command } from "../../Command";

export default class MyCards extends Command {
    constructor(client: Plexi) {
        super(client, {
            name: "mycards",
            description: "View a list of the cards you currently have (and your deck)",
            group: "Catrd",
        });
    }
}
