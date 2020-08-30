import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Pout extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "pout", "Pout", "pouting", true);
    }
}
