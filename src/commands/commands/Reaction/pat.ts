import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Pat extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "pat", "Pat", "pet");
    }
}
