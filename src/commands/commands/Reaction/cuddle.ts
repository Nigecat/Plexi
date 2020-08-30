import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Cuddle extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "cuddle", "Cuddle", "cuddled");
    }
}
