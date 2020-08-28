import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Lewd extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "lewd", "Lewd", "... lewd?", true);
    }
}
