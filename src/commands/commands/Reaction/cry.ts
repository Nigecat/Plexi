import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Cry extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "cry", "Cry", "crying", true, false);
    }
}
