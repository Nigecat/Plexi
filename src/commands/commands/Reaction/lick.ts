import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Lick extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "lick", "Lick", "licked");
    }
}
