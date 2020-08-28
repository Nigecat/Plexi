import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Wave extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "wave", "Wave", "waving", true);
    }
}
