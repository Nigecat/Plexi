import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Surprised extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "surprised", "Surprised", "surprised", true);
    }
}
