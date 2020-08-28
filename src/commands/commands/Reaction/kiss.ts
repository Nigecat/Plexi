import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Kiss extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "kiss", "Kiss", "kissed");
    }
}
