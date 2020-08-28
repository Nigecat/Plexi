import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Run extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "run", "Run", "running", true);
    }
}
