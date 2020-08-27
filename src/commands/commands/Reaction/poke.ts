import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Poke extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "poke", "Poke", "poked");
    }
}
