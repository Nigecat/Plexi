import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Shocked extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "shocked", "Shocked", "shocked", true);
    }
}
