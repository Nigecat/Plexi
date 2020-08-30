import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Laugh extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "laugh", "Laugh", "laughing", true);
    }
}
