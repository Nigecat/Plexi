import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Tickle extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "tickle", "Tickle", "tickled");
    }
}
