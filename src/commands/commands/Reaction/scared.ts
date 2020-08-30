import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Scared extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "scared", "Scared", "scared", true);
    }
}
