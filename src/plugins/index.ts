import someone from "./someone";
import { Plexi } from "../Plexi";
import theideasman from "./theideasman";

// eslint-disable-next-line prettier/prettier
export default <Plugin[]>[
    someone,
    theideasman,
];

export interface Plugin {
    (client: Plexi): void;
}
