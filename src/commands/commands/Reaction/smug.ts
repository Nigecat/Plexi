import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Smug extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "smug", "Smug", "smug", true);
    }
}
