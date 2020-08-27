import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Amazed extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "amazed", "Amazed", "amazed", true);
    }
}
