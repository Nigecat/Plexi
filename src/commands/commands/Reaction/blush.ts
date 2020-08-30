import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Blush extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "blush", "Blush", "blushing", true);
    }
}
