import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Punch extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "punch", "Punch", "punched");
    }
}
