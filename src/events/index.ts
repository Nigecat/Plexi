import message from "./message";
import { Plexi } from "../Plexi";

export default <EventHandlers>{ message };

export interface EventHandlers {
    [key: string]: EventHandler;
}

export interface EventHandler {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (args: any, client: Plexi): void;
}
