import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Hug extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "hug", "Hug", "hugged");
    }
}
