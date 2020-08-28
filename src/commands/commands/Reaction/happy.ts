import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Happy extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "happy", "Happy", "happy", true);
    }
}
