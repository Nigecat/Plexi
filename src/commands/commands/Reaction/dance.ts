import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Dance extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "dance", "Dance", "dancing", true);
    }
}
