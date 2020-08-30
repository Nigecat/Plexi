import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Slap extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "slap", "Slap", "slapped");
    }
}
