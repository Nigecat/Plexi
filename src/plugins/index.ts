import someone from "./someone";
import { Plexi } from "../Plexi";
import theideasman from "./theideasman";

export default <Plugin[]>[someone, theideasman];

export interface Plugin {
    (client: Plexi): void;
}
