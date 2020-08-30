import { Plexi } from "../../../Plexi";
import ReactionCommand from "../../extras/ReactionCommand";

export default class Bite extends ReactionCommand {
    constructor(client: Plexi) {
        super(client, "bite", "Bite", "bitten");
    }
}
