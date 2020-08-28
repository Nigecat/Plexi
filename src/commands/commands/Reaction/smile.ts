import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Smile extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "smile", "Smile", "smiling", true);
    }
}
