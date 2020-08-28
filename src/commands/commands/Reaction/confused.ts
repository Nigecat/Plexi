import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Confused extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "confused", "Confused", "confused", true);
    }
}
