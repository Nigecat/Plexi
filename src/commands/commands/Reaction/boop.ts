import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Boop extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "boop", "Boop", "booped");
    }
}
